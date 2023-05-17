import { Construct } from 'constructs'
import { Stack, SecretValue } from 'aws-cdk-lib'
import { aws_cognito as cognito, aws_iam as iam } from 'aws-cdk-lib'
import { IdentityPool } from './identity-pool'
import { ProviderAttribute, UserPoolIdentityProviderGoogle } from 'aws-cdk-lib/aws-cognito'

type WebUserPoolProps = {
  appName: string
}

export class WebUserPool extends Construct {
  private readonly _userPool: cognito.UserPool
  private readonly _appName: string
  private _identityPool: IdentityPool
  private _userPoolClient: cognito.UserPoolClient
  private _userPoolDomain: cognito.UserPoolDomain

  constructor(scope: Construct, id: string, props: WebUserPoolProps) {
    super(scope, id)

    this._appName = props.appName

    this._userPool = new cognito.UserPool(this, 'my-app-user-pool', {
      userPoolName: `${this._appName.replace(/[^a-zA-Z0-9]/gu, '-')}-user-pool`,
      standardAttributes: {
        email: {
          required: true,
          mutable: true
        }
      },
      signInAliases: {
        username: false,
        email: true
      },
      autoVerify: {
        email: true
      }
    })

    const cfnConstruct = this._userPool.node.defaultChild as cognito.CfnUserPool
    cfnConstruct.userPoolAddOns = {
      advancedSecurityMode: 'ENFORCED'
    }
  }

  withDomainPrefix(domainPrefix: string): WebUserPool {
    this._userPoolDomain = this._userPool.addDomain('my-app-cognito-domain', {
      cognitoDomain: {
        domainPrefix
      }
    })

    return this
  }

  withIdentityProvider(identityProviderSecretName: string): WebUserPool {
    this._userPool.registerIdentityProvider(
      new UserPoolIdentityProviderGoogle(this, 'oidc-provider', {
        userPool: this._userPool,
        clientId: SecretValue.secretsManager(identityProviderSecretName, {
          jsonField: 'ClientID'
        }).toString(),
        clientSecretValue: SecretValue.secretsManager(identityProviderSecretName, {
          jsonField: 'ClientSecret'
        }),
        scopes: ['openid', 'email'],
        attributeMapping: {
          email: ProviderAttribute.other('email')
        }
      })
    )

    return this
  }

  withClient(callbackUrls: string[], logoutUrls: string[]): WebUserPool {
    this._userPoolClient = this._userPool.addClient('web-client', {
      userPoolClientName: `${this._appName.replace(/[^a-zA-Z0-9]/gu, '-')}-web-client`,
      supportedIdentityProviders: this._userPool.identityProviders.map((idp) =>
        cognito.UserPoolClientIdentityProvider.custom(idp.providerName)
      ),
      authFlows: {
        adminUserPassword: false,
        custom: false,
        userPassword: true,
        userSrp: true
      },
      disableOAuth: false,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
          implicitCodeGrant: false,
          clientCredentials: false
        },
        scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL, cognito.OAuthScope.PROFILE],
        callbackUrls,
        logoutUrls
      }
    })

    return this
  }

  withS3Access(bucketArn: string, dataKeyPrefix: string): WebUserPool {
    this._identityPool = new IdentityPool(this, 'my-app-identity-pool', {
      identityPoolName: `${this._appName.replace(/[^a-zA-Z0-9]/gu, '_')}_identity_pool`,
      userPoolProviderName: this._userPool.userPoolProviderName,
      userPoolClientId: this._userPoolClient.userPoolClientId,
      authenticatedRolePolicies: [
        new iam.PolicyStatement({
          actions: ['s3:DeleteObject', 's3:GetObject', 's3:PutObject', 's3:PutObjectAcl'],
          resources: [[bucketArn, dataKeyPrefix, '*'].join('/')]
        })
      ]
    })

    return this
  }

  getUserPoolId(): string {
    return this._userPool.userPoolId
  }

  getUserPoolLoginFQDN(): string {
    const stack = Stack.of(this)

    return `${this._userPoolDomain.domainName}.auth.${stack.region}.amazoncognito.com`
  }

  getUserPoolClientId(): string {
    return this._userPoolClient.userPoolClientId
  }

  getProviderName(): string {
    return this._userPool.userPoolProviderName
  }

  getIdentityPoolId(): string {
    return this._identityPool.getUnderlyingIdentityPool().ref
  }
}

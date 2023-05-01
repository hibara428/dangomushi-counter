import { Construct } from 'constructs'
import { aws_cognito as cognito, aws_iam as iam } from 'aws-cdk-lib'
import { IdentityPoolRole, IdentityPoolRoleTypeEnum } from './identity-pool-role'

type AppIdpProps = {
  appName: string
  bucketArn: string
  dataKeyPrefix: string
}

export class AppIdp extends Construct {
  private readonly _appName: string
  private readonly _identityPool: cognito.CfnIdentityPool

  constructor(scope: Construct, id: string, props: AppIdpProps) {
    super(scope, id)

    this._appName = props.appName

    this._identityPool = new cognito.CfnIdentityPool(this, 'unauth-identity-pool', {
      allowClassicFlow: true,
      allowUnauthenticatedIdentities: true,
      identityPoolName: `${props.appName.replace(/[^a-zA-Z0-9]/gu, '_')}_unauth-idp`
    })

    const authenticatedRole = new IdentityPoolRole(this, 'unauth-idp-auth-role', {
      roleType: IdentityPoolRoleTypeEnum.Authenticated,
      identityPoolId: this._identityPool.ref
    })
    const unauthenticatedRole = new IdentityPoolRole(this, 'unauth-idp-unauth-role', {
      roleType: IdentityPoolRoleTypeEnum.Unauthenticated,
      identityPoolId: this._identityPool.ref
    })

    const policy = new iam.PolicyStatement({
      actions: ['s3:DeleteObject', 's3:GetObject', 's3:PutObject', 's3:PutObjectAcl'],
      resources: [[props.bucketArn, props.dataKeyPrefix, '*'].join('/')]
    })
    authenticatedRole.getUnderlyingRole().addToPolicy(policy)
    unauthenticatedRole.getUnderlyingRole().addToPolicy(policy)

    new cognito.CfnIdentityPoolRoleAttachment(this, 'unauth-identity-pool-roles', {
      identityPoolId: this._identityPool.ref,
      roles: {
        authenticated: authenticatedRole.getUnderlyingRole().roleArn,
        unauthenticated: unauthenticatedRole.getUnderlyingRole().roleArn
      }
    })
  }

  getUnderlyingIdentityPool(): cognito.CfnIdentityPool {
    return this._identityPool
  }
}

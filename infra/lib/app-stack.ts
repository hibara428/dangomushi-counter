import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { WebUserPool } from './constructs/app-user-pool'
import { AppCdn } from './constructs/app-cdn'
import { AppDeployRole } from './constructs/app-deploy-role'

type AppStackProps = StackProps & {
  appName: string
  dataKeyPrefix: string
  hostedZoneName: string
  domainName: string
  certificateArn: string
  gitHubOrgName: string
  githubRepoName: string
}

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props)

    /* Resources */
    // Cognito UserPool
    const userPool = new WebUserPool(this, 'web-user-pool', {
      appName: props.appName
    })
      .withDomainPrefix(`${props.appName}-login`)
      .withIdentityProvider(`${props.appName}/oidc`, 'us-east-1')

    // CloudFront+S3
    const cdn = new AppCdn(this, 'web-app-cdn', {
      appName: props.appName,
      hostedZoneName: props.hostedZoneName,
      domainName: props.domainName,
      certificateArn: props.certificateArn
    })
      .withLambdaProtection()
      .withCDN()
      .withUserPool(userPool)

    // Add S3 accesses to UserPool
    userPool.withS3Access(cdn.getBucketArn(), props.dataKeyPrefix)

    // IAM role for deploy
    new AppDeployRole(this, 'deploy-role', {
      bucketArn: cdn.getBucketArn(),
      gitHubOrgName: props.gitHubOrgName,
      gitHubRepoName: props.githubRepoName
    })

    /* Outputs */
    new CfnOutput(this, 'UserPoolClientId', {
      exportName: `${this.stackName}-IcWebClientId`,
      value: userPool.getUserPoolClientId()
    })

    new CfnOutput(this, 'CloudFrontFqdn', {
      exportName: `${this.stackName}-CdnFqdn`,
      value: cdn.getDomainName()
    })

    new CfnOutput(this, 'CloudFrontDistributionId', {
      exportName: `${this.stackName}-CdnDistributionId`,
      value: cdn.getDistributionId()
    })

    new CfnOutput(this, 'S3BucketName', {
      exportName: `${this.stackName}-S3BucketName`,
      value: cdn.getBucketName()
    })

    new CfnOutput(this, 'IdentityPoolArn', {
      exportName: `${this.stackName}-IdentityPool`,
      value: userPool.getIdentityPoolId()
    })

    new CfnOutput(this, 'UserPoolId', {
      exportName: `${this.stackName}-UserPoolId`,
      value: userPool.getUserPoolId()
    })

    new CfnOutput(this, 'UserPoolDomain', {
      exportName: `${this.stackName}-UserPoolDomain`,
      value: userPool.getUserPoolLoginFQDN()
    })
  }
}

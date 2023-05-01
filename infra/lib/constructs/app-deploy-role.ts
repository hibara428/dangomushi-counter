import { Construct } from 'constructs'
import { Stack, aws_iam as iam } from 'aws-cdk-lib'

type AppDeployRoleProps = {
  bucketArn: string
  gitHubOrgName: string
  gitHubRepoName: string
}

export class AppDeployRole extends Construct {
  private readonly _role: iam.Role

  constructor(scope: Construct, id: string, props: AppDeployRoleProps) {
    super(scope, id)

    const stack = Stack.of(this)

    this._role = new iam.Role(this, 'deploy-role', {
      assumedBy: new iam.FederatedPrincipal(
        `arn:aws:iam::${stack.account}:oidc-provider/token.actions.githubusercontent.com`,
        {
          StringLike: {
            'token.actions.githubusercontent.com:sub': `repo:${props.gitHubOrgName}/${props.gitHubRepoName}:*`
          }
        },
        'sts:AssumeRoleWithWebIdentity'
      )
    })
    const s3ListPolicy = new iam.PolicyStatement({
      actions: ['s3:ListBucket'],
      resources: [props.bucketArn]
    })
    this._role.addToPolicy(s3ListPolicy)

    const s3UpdatePolicy = new iam.PolicyStatement({
      actions: ['s3:DeleteObject', 's3:GetObject', 's3:PutObject', 's3:PutObjectAcl'],
      resources: [[props.bucketArn, '*'].join('/')]
    })
    this._role.addToPolicy(s3UpdatePolicy)
  }

  getUnderlyingRole(): iam.Role {
    return this._role
  }
}

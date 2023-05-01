import { Construct } from 'constructs'
import { aws_ssm as ssm } from 'aws-cdk-lib'

type SsmAuthHandlerProps = {
  appName: string
  userPoolId: string
  userPoolDomain: string
  userPoolClientId: string
}

export class SsmAuthHandler extends Construct {
  private readonly _appName: string

  constructor(scope: Construct, id: string, props: SsmAuthHandlerProps) {
    super(scope, id)

    this._appName = props.appName

    new ssm.StringParameter(this, 'user-pool-id', {
      parameterName: `/${this._appName}/user-pool-id`,
      stringValue: props.userPoolId
    })

    new ssm.StringParameter(this, 'user-pool-domain-prefix', {
      parameterName: `/${this._appName}/user-pool-domain`,
      stringValue: props.userPoolDomain
    })

    new ssm.StringParameter(this, 'user-pool-client-id', {
      parameterName: `/${this._appName}/user-pool-client-id`,
      stringValue: props.userPoolClientId
    })
  }
}

import { Construct } from 'constructs'
import { Stack, StackProps } from 'aws-cdk-lib'
import { RemoteOutputs } from 'cdk-remote-stack'
import { AppStack } from './app-stack'

type RemoteOutputProps = StackProps & {
  appStack: AppStack
}

export class RemoteOutputStack extends Stack {
  public readonly userPoolIdauthLambdaAtEdgeCurrentArn: string
  public readonly userPoolId: string
  public readonly userPoolDomain: string
  public readonly userPoolClientId: string

  constructor(scope: Construct, id: string, props: RemoteOutputProps) {
    super(scope, id, props)

    const outputs = new RemoteOutputs(this, 'Outputs', { stack: props.appStack })

    this.userPoolId = outputs.get('UserPoolId')
    this.userPoolDomain = outputs.get('UserPoolDomain')
    this.userPoolClientId = outputs.get('UserPoolClientId')
  }
}

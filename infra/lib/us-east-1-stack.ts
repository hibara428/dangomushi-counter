import { Construct } from 'constructs'
import { Stack, StackProps } from 'aws-cdk-lib'
import { SsmAuthHandler } from './constructs/ssm-auth-handler'

type UsEast1StackProps = StackProps & {
  appName: string
  userPoolId: string
  userPoolDomain: string
  userPoolClientId: string
}

export class UsEast1Stack extends Stack {
  constructor(scope: Construct, id: string, props: UsEast1StackProps) {
    super(scope, id, props)

    /* Resources */
    // SSM for Lambda@Edge
    new SsmAuthHandler(this, 'ssm-auth-handler', {
      appName: props.appName,
      userPoolId: props.userPoolId,
      userPoolDomain: props.userPoolDomain,
      userPoolClientId: props.userPoolClientId
    })
  }
}

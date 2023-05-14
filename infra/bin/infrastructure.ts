#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import * as dotenv from 'dotenv';
import { AppStack } from '../lib/app-stack';
import { UsEast1Stack } from '../lib/us-east-1-stack';
import { RemoteOutputStack } from '../lib/remote-output-stack';

/* Configurations */
dotenv.config();

const app = new App();
const appName = app.node.tryGetContext('app-name');
const dataKeyPrefix = process.env.DATA_KEY_PREFIX;
const domainName = process.env.DOMAIN_NAME;
const hostedZoneName = process.env.HOSTED_ZONE_NAME;
const certificateArn = process.env.ACM_CERTIFICATE_ARN;
const gitHubOrgName = process.env.GITHUB_ORG_NAME;
const gitHubRepoName = process.env.GITHUB_REPO_NAME;

if (appName === undefined || appName === '') {
  throw new Error('Must specify app name: -c app-name=my-web-app');
}
if (
  dataKeyPrefix === undefined ||
  domainName === undefined ||
  hostedZoneName === undefined ||
  certificateArn === undefined ||
  gitHubOrgName === undefined ||
  gitHubRepoName === undefined
) {
  throw new Error('Must set environment variables. Please set a .env file.');
}

/* Stacks */
// アプリケーションスタック
const appStack = new AppStack(app, 'AppStack', {
  stackName: appName,
  appName: appName,
  dataKeyPrefix: dataKeyPrefix,
  hostedZoneName: hostedZoneName,
  domainName: domainName,
  certificateArn: certificateArn,
  gitHubOrgName: gitHubOrgName,
  githubRepoName: gitHubRepoName,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
  crossRegionReferences: true
});
// 受け渡し用中間スタック
const remoteOutputStack = new RemoteOutputStack(app, 'RemoteOutputStack', {
  stackName: `${appName}-remote-output`,
  appStack: appStack,
  env: {
    region: 'us-east-1'
  }
});
remoteOutputStack.addDependency(appStack);
// us-east-1専用リソーススタック
const usEast1Stack = new UsEast1Stack(app, 'UsEast1Stack', {
  stackName: `${appName}-us-east-1`,
  appName: appName,
  userPoolId: remoteOutputStack.userPoolId,
  userPoolDomain: remoteOutputStack.userPoolDomain,
  userPoolClientId: remoteOutputStack.userPoolClientId,
  env: {
    region: 'us-east-1'
  }
});
usEast1Stack.addDependency(remoteOutputStack);

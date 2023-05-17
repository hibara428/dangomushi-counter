import { Construct } from 'constructs'
import {
  Stack,
  RemovalPolicy,
  Duration,
  aws_iam as iam,
  aws_s3 as s3,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_wafv2 as wafv2,
  aws_lambda as lambda,
  aws_route53 as route53,
  aws_route53_targets as targets,
  aws_certificatemanager as certificatemanager
} from 'aws-cdk-lib'

import fs from 'fs'
import { WebUserPool } from './app-user-pool'
import { NodejsEdgeFunction } from '../helpers/nodejs-edge-function'

enum HttpStatus {
  OK = 200,
  Unauthorized = 403,
  NotFound = 404
}

type AppCdnProps = {
  appName: string
  hostedZoneName: string
  domainName: string
  certificateArn: string
}

export class AppCdn extends Construct {
  private readonly _appName: string
  private readonly _hostedZoneName: string
  private readonly _domainName: string
  private readonly _certificateArn: string
  private readonly _frontendS3Bucket: s3.Bucket
  private readonly _accessLogBucket: s3.Bucket
  private readonly _fqdn: string
  private _lambdaAtEdge: cloudfront.experimental.EdgeFunction
  private _wafACL: wafv2.CfnWebACL
  private _distribution: cloudfront.Distribution

  constructor(scope: Construct, id: string, props: AppCdnProps) {
    super(scope, id)

    this._appName = props.appName
    this._hostedZoneName = props.hostedZoneName
    this._domainName = props.domainName
    this._certificateArn = props.certificateArn
    this._fqdn = `${this._domainName}.${this._hostedZoneName}`

    const stack = Stack.of(this)

    this._accessLogBucket = new s3.Bucket(this, 'access-log-bucket', {
      accessControl: s3.BucketAccessControl.LOG_DELIVERY_WRITE,
      bucketName: `${stack.stackName}-${stack.region}-${stack.account}-logs`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
      serverAccessLogsPrefix: 'access-log-bucket/'
    })

    /* S3 bucket for react app CDN */
    this._frontendS3Bucket = new s3.Bucket(this, 'frontend-bucket', {
      accessControl: s3.BucketAccessControl.PRIVATE,
      bucketName: `${stack.stackName}-${stack.region}-${stack.account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedOrigins: ['*'],
          allowedMethods: [
            s3.HttpMethods.HEAD,
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.DELETE
          ],
          allowedHeaders: ['*']
        }
      ],
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
      serverAccessLogsBucket: this._accessLogBucket,
      serverAccessLogsPrefix: 'frontent-bucket/'
    })
  }

  withLambdaProtection(): AppCdn {
    const stack = Stack.of(this)

    const jsonIndentSpaces = 4
    fs.writeFileSync(
      './lib/constructs/app-cdn.auth-handler.config.json',
      JSON.stringify(
        {
          AppName: this._appName
        },
        null,
        jsonIndentSpaces
      )
    )

    this._lambdaAtEdge = new NodejsEdgeFunction(this, 'auth-handler', {
      runtime: lambda.Runtime.NODEJS_14_X
    })
    this._lambdaAtEdge.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['ssm:GetParameter'],
        resources: [`arn:aws:ssm:us-east-1:${stack.account}:parameter/${this._appName}/*`]
      })
    )

    return this
  }

  withCDN(): AppCdn {
    const hostedZone = route53.HostedZone.fromLookup(this, 'route53-hosted-zone', {
      domainName: this._hostedZoneName,
      privateZone: false
    })
    const certificate = certificatemanager.Certificate.fromCertificateArn(
      this,
      'domain-certicate',
      this._certificateArn
    )

    /* CDN */
    const defaultErrorResponseTTLSeconds = 10
    this._distribution = new cloudfront.Distribution(this, 'frontend-distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(this._frontendS3Bucket),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        compress: false,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED_FOR_UNCOMPRESSED_OBJECTS,
        edgeLambdas: [
          {
            eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
            functionVersion: this._lambdaAtEdge.currentVersion
          }
        ]
      },
      httpVersion: cloudfront.HttpVersion.HTTP1_1,
      enableIpv6: false,
      defaultRootObject: '/index.html',
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      errorResponses: [
        {
          httpStatus: HttpStatus.NotFound,
          responseHttpStatus: HttpStatus.OK,
          responsePagePath: '/index.html',
          ttl: Duration.seconds(defaultErrorResponseTTLSeconds)
        },
        {
          httpStatus: HttpStatus.Unauthorized,
          responseHttpStatus: HttpStatus.OK,
          responsePagePath: '/index.html',
          ttl: Duration.seconds(defaultErrorResponseTTLSeconds)
        }
      ],
      webAclId: this._wafACL?.attrArn,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      logBucket: this._accessLogBucket,
      logFilePrefix: 'frontend-distribution/',
      domainNames: [this._fqdn],
      certificate: certificate
    })

    /* Route53 record */
    new route53.ARecord(this, 'cdn-record', {
      zone: hostedZone,
      recordName: this._domainName,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(this._distribution))
    })

    return this
  }

  withUserPool(userPool: WebUserPool): AppCdn {
    /* Cognito web app client for Frontend */
    const callbackUrls = [`https://${this._fqdn}`]
    const logoutUrls = [`https://${this._fqdn}/logout`]

    userPool.withClient(callbackUrls, logoutUrls)

    return this
  }

  getDomainName(): string {
    return this._distribution.domainName
  }

  getDistributionId(): string {
    return this._distribution.distributionId
  }

  getBucketName(): string {
    return this._frontendS3Bucket.bucketName
  }

  getBucketArn(): string {
    return this._frontendS3Bucket.bucketArn
  }
}

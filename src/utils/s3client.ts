import { S3Client } from '@aws-sdk/client-s3'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers'

// constants
const REGION = import.meta.env.VITE_AWS_REGION || 'ap-northeast-1'
const USER_POOL_ID = import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID || ''
const IDENTITY_POOL_ID = import.meta.env.VITE_AWS_COGNITO_IDENTITY_POOL_ID || ''

// methods
/**
 * Get S3 client.
 *
 * @param idToken
 * @returns S3 client
 */
export const getS3Client = (idToken: string): S3Client => {
  return new S3Client({
    region: REGION,
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: REGION },
      identityPoolId: IDENTITY_POOL_ID,
      logins: {
        [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: idToken
      }
    })
  })
}

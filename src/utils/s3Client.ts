import {
  S3Client,
  GetObjectCommand,
  type GetObjectCommandInput,
  type GetObjectCommandOutput,
  PutObjectCommand,
  type PutObjectCommandInput
} from '@aws-sdk/client-s3'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers'

const REGION = import.meta.env.VITE_REGION || 'ap-northeast-1'
const IDENTITY_POOL_ID = import.meta.env.VITE_IDENTITY_POOL_ID || ''
const s3Client = new S3Client({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: REGION },
    identityPoolId: IDENTITY_POOL_ID
  })
})

/**
 * Get object
 *
 * @param input
 * @returns
 */
export const getObject = async (
  input: GetObjectCommandInput
): Promise<GetObjectCommandOutput | undefined> => {
  return await s3Client.send(new GetObjectCommand(input))
}
/**
 * Put object
 *
 * @param input
 * @returns
 */
export const putObject = async (input: PutObjectCommandInput) => {
  return await s3Client.send(new PutObjectCommand(input))
}

import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getS3Client } from '@/utils/s3client'
import type { CognitoUser } from '@/utils/cognito'

// constants
const BUCKET_NAME = import.meta.env.VITE_AWS_S3_BUCKET || 'roly-poly-counter'
const OBJECT_DIR = import.meta.env.VITE_OBJECT_DIR || 'data'

// interfaces
export interface DirectionCounts {
  east: number
  west: number
  south: number
  north: number
}
export interface OtherCounts {
  dog?: number
  cat?: number
  butterfly?: number
}
export class Stats {
  rolyPoly: DirectionCounts
  others: OtherCounts

  /**
   * Constructor.
   *
   * @param rolyPoly
   * @param others
   */
  constructor(rolyPoly?: DirectionCounts, others?: OtherCounts) {
    this.rolyPoly = {
      east: rolyPoly?.east || 0,
      west: rolyPoly?.west || 0,
      south: rolyPoly?.south || 0,
      north: rolyPoly?.north || 0
    }
    this.others = {
      dog: others?.dog || 0,
      cat: others?.cat || 0,
      butterfly: others?.butterfly || 0
    }
  }

  /**
   * Merge stats.
   *
   * @param stats
   * @returns
   */
  merge(stats: Stats): Stats {
    this.rolyPoly.east += stats.rolyPoly.east
    this.rolyPoly.west += stats.rolyPoly.west
    this.rolyPoly.south += stats.rolyPoly.south
    this.rolyPoly.north += stats.rolyPoly.north
    if (!this.others?.dog) {
      this.others.dog = 0
    }
    this.others.dog += stats.others?.dog || 0
    if (!this.others?.cat) {
      this.others.cat = 0
    }
    this.others.cat += stats.others?.cat || 0
    if (!this.others?.butterfly) {
      this.others.butterfly = 0
    }
    this.others.butterfly += stats.others?.butterfly || 0
    return this
  }
}

/**
 * Get statistics file name.
 *
 * @param year
 * @returns
 */
const getFileName = (year?: number | undefined): string => {
  return 'data' + (year || new Date().getFullYear()) + '.json'
}
/**
 * Get statistics object key.
 *
 * @param email
 * @param year
 * @returns
 */
const getObjectKey = (email: string, year?: number | undefined): string => {
  return [OBJECT_DIR, email, getFileName(year)].join('/')
}
/**
 * Load statistics object from S3
 *
 * @param loginUser
 * @returns
 */
export const loadStatsFromS3 = async (loginUser: CognitoUser): Promise<Stats> => {
  const s3Client = getS3Client(loginUser.idToken)
  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: getObjectKey(loginUser.email)
    })
  )
  const data = await response?.Body?.transformToString()
  const parsed = JSON.parse(data || '{}')
  if (parsed.rolyPoly === undefined || parsed.others === undefined) {
    throw new Error('Invalid stats file.')
  }
  return new Stats(parsed.rolyPoly, parsed.others)
}
/**
 * Save statistics object to S3
 *
 * @param loginUser
 * @param stats
 */
export const saveStatsToS3 = async (loginUser: CognitoUser, stats: Stats): Promise<void> => {
  const s3Client = getS3Client(loginUser.idToken)
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: getObjectKey(loginUser.email),
      Body: JSON.stringify(stats)
    })
  )
}

import { getObject, putObject } from '@/utils/s3Client'
import type { GetObjectCommandInput, PutObjectCommandInput } from '@aws-sdk/client-s3'

// constants
export const BUCKET_NAME = 'roly-poly-counter'
export const OBJECT_DIR = 'data'
// interfaces
export interface DirectionCounts {
  east: number
  west: number
  south: number
  north: number
}
export interface Stats {
  rolyPoly?: DirectionCounts
  dogs?: number
  cats?: number
  butterfly?: number
}
// methods
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
 * @param year
 * @returns
 */
export const getObjectKey = (year?: number | undefined): string => {
  return [OBJECT_DIR, getFileName(year)].join('/')
}
/**
 * Load statistics object from S3
 *
 * @param input
 * @returns
 */
export const loadStatsFromS3 = async (input: GetObjectCommandInput): Promise<Stats> => {
  const response = await getObject(input)
  const data = await response?.Body?.transformToString()
  return JSON.parse(data || '{}')
}
/**
 * Save statistics object to S3
 *
 * @param input
 */
export const saveStatsToS3 = async (input: PutObjectCommandInput): Promise<void> => {
  await putObject(input)
}
/**
 * Merge stats
 *
 * @param beforeStats
 * @param stats
 * @returns
 */
export const mergeStats = (beforeStats: Stats, stats: Stats): Stats => {
  return {
    rolyPoly: {
      east: (beforeStats.rolyPoly?.east || 0) + (stats.rolyPoly?.east || 0),
      west: (beforeStats.rolyPoly?.west || 0) + (stats.rolyPoly?.west || 0),
      south: (beforeStats.rolyPoly?.south || 0) + (stats.rolyPoly?.south || 0),
      north: (beforeStats.rolyPoly?.north || 0) + (stats.rolyPoly?.north || 0)
    },
    dogs: (beforeStats.dogs || 0) + (stats.dogs || 0),
    cats: (beforeStats.cats || 0) + (stats.cats || 0),
    butterfly: (beforeStats.butterfly || 0) + (stats.butterfly || 0)
  }
}

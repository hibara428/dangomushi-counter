import { getObject, putObject } from '@/utils/s3Client'
import type { GetObjectCommandInput, PutObjectCommandInput } from '@aws-sdk/client-s3'

// constants
export const BUCKET_NAME = 'roly-poly-counter'
export const OBJECT_DIR = 'data'
// interfaces
export interface Stats {
  rolyPoly: {
    totals: {
      east: number
      west: number
      south: number
      north: number
    }
  }
  dogs?: {
    total: number
  }
  cats?: {
    total: number
  }
  butterfly?: {
    total: number
  }
}
// methods
/**
 * Get statistics object key.
 *
 * @param year
 * @returns
 */
export const getObjectKey = (year?: number | undefined): string => {
  const fileName = 'data' + (year || new Date().getFullYear()) + '.json'
  return [OBJECT_DIR, fileName].join('/')
}
/**
 * Load statistics object from S3
 *
 * @param input
 * @returns
 */
export const loadStatsFromS3 = async (input: GetObjectCommandInput): Promise<Stats> => {
  const response = await getObject(input)
  const data = (await response?.Body?.transformToString()) || '{}'
  return JSON.parse(data)
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
      totals: {
        east: beforeStats.rolyPoly.totals.east + stats.rolyPoly.totals.east,
        west: beforeStats.rolyPoly.totals.west + stats.rolyPoly.totals.west,
        south: beforeStats.rolyPoly.totals.south + stats.rolyPoly.totals.south,
        north: beforeStats.rolyPoly.totals.north + stats.rolyPoly.totals.north
      }
    },
    dogs: {
      total: (beforeStats.dogs?.total || 0) + (stats.dogs?.total || 0)
    },
    cats: {
      total: (beforeStats.cats?.total || 0) + (stats.cats?.total || 0)
    },
    butterfly: {
      total: (beforeStats.butterfly?.total || 0) + (stats.butterfly?.total || 0)
    }
  }
}

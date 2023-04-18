<script setup lang="ts">
import { reactive } from 'vue'
import ContentTitle from '@/components/ContentTitle.vue'
import DailyCountsTable from '@/components/DailyCountsTable.vue'
import type { RolyPolyCountsProps } from '@/components/RolyPolyCountsTable.vue'
import type { OtherCountsProps } from '@/components/OtherCountsTable.vue'
import CounterPanel from '@/components/CounterPanel.vue'
import {
  type Stats,
  getObjectKey,
  loadStatsFromS3,
  saveStatsToS3,
  mergeStats,
  BUCKET_NAME
} from '@/utils/stats'

// data
let rolyPolyCounts: RolyPolyCountsProps = reactive({
  eastCount: 0,
  westCount: 0,
  southCount: 0,
  northCount: 0
})
let otherCounts: OtherCountsProps = reactive({
  dogCount: 0,
  catCount: 0,
  butterflyCount: 0
})
// methods
/**
 * カウンタリセット
 */
const reset = () => {
  rolyPolyCounts.eastCount = 0
  rolyPolyCounts.westCount = 0
  rolyPolyCounts.southCount = 0
  rolyPolyCounts.northCount = 0
  otherCounts.dogCount = 0
  otherCounts.catCount = 0
  otherCounts.butterflyCount = 0
}
/**
 * カウントアップ
 * @param label
 */
const countUp = (label: string) => {
  switch (label) {
    case 'east':
      rolyPolyCounts.eastCount++
      break
    case 'west':
      rolyPolyCounts.westCount++
      break
    case 'south':
      rolyPolyCounts.southCount++
      break
    case 'north':
      rolyPolyCounts.northCount++
      break
    case 'dog':
      otherCounts.dogCount++
      break
    case 'cat':
      otherCounts.catCount++
      break
    case 'butterfly':
      otherCounts.butterflyCount++
      break
  }
}
/**
 * 統計データの変換
 */
const convertDataToStats = (): Stats => {
  return {
    rolyPoly: {
      east: rolyPolyCounts.eastCount,
      west: rolyPolyCounts.westCount,
      south: rolyPolyCounts.southCount,
      north: rolyPolyCounts.northCount
    },
    dogs: otherCounts.dogCount,
    cats: otherCounts.catCount,
    butterfly: otherCounts.butterflyCount
  }
}
/**
 * 記録終了
 */
const endCount = () => {
  ;(async () => {
    try {
      // 累積データの取得
      const beforeStats = await loadStatsFromS3({
        Bucket: BUCKET_NAME,
        Key: getObjectKey()
      })
      const stats = convertDataToStats()
      // 累積データの更新
      const mergedStats = mergeStats(beforeStats, stats)
      // 累積データの保存
      await saveStatsToS3({
        Bucket: BUCKET_NAME,
        Key: getObjectKey(),
        Body: JSON.stringify(mergedStats)
      })
      // カウンタリセット
      reset()
    } catch (error) {
      console.error(error)
    }
  })()
}
</script>

<template>
  <div class="container-fluid">
    <ContentTitle title="Daily Counter" />
    <DailyCountsTable :roly-poly-counts="rolyPolyCounts" :other-counts="otherCounts" />
  </div>
  <CounterPanel @count-up="countUp" @end-count="endCount" />
</template>

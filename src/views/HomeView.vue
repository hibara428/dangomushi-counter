<script setup lang="ts">
import { reactive } from 'vue'
import ContentTitle from '@/components/ContentTitle.vue'
import DailyCountsTable from '@/components/DailyCountsTable.vue'
import CounterPanel from '@/components/CounterPanel.vue'
import {
  type Stats,
  getObjectKey,
  loadStatsFromS3,
  saveStatsToS3,
  mergeStats,
  BUCKET_NAME,
  type DirectionCounts,
  type OtherCounts
} from '@/utils/stats'

// data
let rolyPolyCounts: DirectionCounts = reactive({
  east: 0,
  west: 0,
  south: 0,
  north: 0
})
let otherCounts: OtherCounts = reactive({
  dog: 0,
  cat: 0,
  butterfly: 0
})
// methods
/**
 * カウンタリセット
 */
const reset = () => {
  rolyPolyCounts.east = 0
  rolyPolyCounts.west = 0
  rolyPolyCounts.south = 0
  rolyPolyCounts.north = 0
  otherCounts.dog = 0
  otherCounts.cat = 0
  otherCounts.butterfly = 0
}
/**
 * カウントアップ
 * @param label
 */
const countUp = (label: string) => {
  switch (label) {
    case 'east':
      rolyPolyCounts.east++
      break
    case 'west':
      rolyPolyCounts.west++
      break
    case 'south':
      rolyPolyCounts.south++
      break
    case 'north':
      rolyPolyCounts.north++
      break
    case 'dog':
      if (!otherCounts.dog) {
        otherCounts.dog = 0
      }
      otherCounts.dog++
      break
    case 'cat':
      if (!otherCounts.cat) {
        otherCounts.cat = 0
      }
      otherCounts.cat++
      break
    case 'butterfly':
      if (!otherCounts.butterfly) {
        otherCounts.butterfly = 0
      }
      otherCounts.butterfly++
      break
  }
}
/**
 * 統計データの変換
 */
const convertDataToStats = (): Stats => {
  return {
    rolyPoly: {
      east: rolyPolyCounts.east,
      west: rolyPolyCounts.west,
      south: rolyPolyCounts.south,
      north: rolyPolyCounts.north
    },
    others: {
      dog: otherCounts.dog || 0,
      cat: otherCounts.cat || 0,
      butterfly: otherCounts.butterfly || 0
    }
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

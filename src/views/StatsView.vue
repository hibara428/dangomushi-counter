<script setup lang="ts">
import { reactive } from 'vue'
import StatsTable from '@/components/StatsTable.vue'
import ContentTitle from '@/components/ContentTitle.vue'
import type { RolyPolyStatsProps } from '@/components/RolyPolyStatsTable.vue'
import type { OtherStatsProps } from '@/components/OtherStatsTable.vue'
import { loadStatsFromS3, type Stats, BUCKET_NAME, OBJECT_KEY } from '@/utils/stats'

// data
let rolyPolyStats: RolyPolyStatsProps = reactive({
  eastCount: 0,
  westCount: 0,
  southCount: 0,
  northCount: 0
})
let otherStats: OtherStatsProps = reactive({
  dogCount: 0,
  catCount: 0,
  butterflyCount: 0
})
// methods
const setupRolyPolyStats = (stats: Stats) => {
  rolyPolyStats.eastCount = stats.rolyPoly.totals.east
  rolyPolyStats.westCount = stats.rolyPoly.totals.west
  rolyPolyStats.southCount = stats.rolyPoly.totals.south
  rolyPolyStats.northCount = stats.rolyPoly.totals.north
}
const setupOtherStats = (stats: Stats) => {
  otherStats.dogCount = stats.dogs?.total || 0
  otherStats.catCount = stats.cats?.total || 0
  otherStats.butterflyCount = stats.butterfly?.total || 0
}
const setup = async () => {
  try {
    const stats = await loadStatsFromS3({
      Bucket: BUCKET_NAME,
      Key: OBJECT_KEY
    })
    setupRolyPolyStats(stats)
    setupOtherStats(stats)
  } catch (error) {
    console.error(error)
  }
}
// init
;(async () => {
  await setup()
})()
</script>

<template>
  <ContentTitle title="Statistics" />
  <StatsTable :roly-poly-stats="rolyPolyStats" :other-stats="otherStats" />
</template>

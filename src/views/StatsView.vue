<script setup lang="ts">
import { reactive } from 'vue'
import StatsTable from '@/components/StatsTable.vue'
import ContentTitle from '@/components/ContentTitle.vue'
import YearsSelect from '@/components/YearsSelect.vue'
import type { RolyPolyStatsProps } from '@/components/RolyPolyStatsTable.vue'
import type { OtherStatsProps } from '@/components/OtherStatsTable.vue'
import { getObjectKey, loadStatsFromS3, type Stats, BUCKET_NAME } from '@/utils/stats'

// data
const startYear = 2022
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
const resetStats = () => {
  rolyPolyStats.eastCount = 0
  rolyPolyStats.westCount = 0
  rolyPolyStats.southCount = 0
  rolyPolyStats.northCount = 0
  otherStats.dogCount = 0
  otherStats.catCount = 0
  otherStats.butterflyCount = 0
}
const setupStats = (stats: Stats) => {
  rolyPolyStats.eastCount = stats.rolyPoly?.east || 0
  rolyPolyStats.westCount = stats.rolyPoly?.west || 0
  rolyPolyStats.southCount = stats.rolyPoly?.south || 0
  rolyPolyStats.northCount = stats.rolyPoly?.north || 0
  otherStats.dogCount = stats.dogs || 0
  otherStats.catCount = stats.cats || 0
  otherStats.butterflyCount = stats.butterfly || 0
}
const setup = async (year: number) => {
  if (year == 0) {
    resetStats()
    return
  }

  const stats = await loadStatsFromS3({
    Bucket: BUCKET_NAME,
    Key: getObjectKey(year)
  })
  setupStats(stats)
}
const selectYear = (year: number) => {
  ;(async () => {
    try {
      await setup(year)
    } catch (error) {
      console.error(error)
    }
  })()
}
</script>

<template>
  <div class="container-fluid">
    <ContentTitle title="Statistics" />
    <YearsSelect :start-year="startYear" @select-year="selectYear" />
    <StatsTable :roly-poly-stats="rolyPolyStats" :other-stats="otherStats" />
  </div>
</template>

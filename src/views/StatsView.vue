<script setup lang="ts">
import { reactive } from 'vue'
import { useStore } from 'vuex'
import { key } from '../stores'
import StatsTable from '@/components/StatsTable.vue'
import ContentTitle from '@/components/ContentTitle.vue'
import YearsSelect from '@/components/YearsSelect.vue'
import { loadStatsFromS3, type Stats, type DirectionCounts, type OtherCounts } from '@/utils/stats'
import { useLoading } from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

// data
const store = useStore(key)
const startYear = 2022
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
const $loading = useLoading({ isFullPage: true })
// methods
const resetStats = () => {
  rolyPolyCounts.east = 0
  rolyPolyCounts.west = 0
  rolyPolyCounts.south = 0
  rolyPolyCounts.north = 0
  otherCounts.dog = 0
  otherCounts.cat = 0
  otherCounts.butterfly = 0
}
const setupStats = (stats: Stats) => {
  rolyPolyCounts.east = stats.rolyPoly?.east || 0
  rolyPolyCounts.west = stats.rolyPoly?.west || 0
  rolyPolyCounts.south = stats.rolyPoly?.south || 0
  rolyPolyCounts.north = stats.rolyPoly?.north || 0
  otherCounts.dog = stats.others?.dog || 0
  otherCounts.cat = stats.others?.cat || 0
  otherCounts.butterfly = stats.others?.butterfly || 0
}
const setup = async (year: number) => {
  if (year == 0) {
    resetStats()
    return
  }

  if (!store.state.loginUser) {
    throw new Error('Login user is not found.')
  }
  const stats = await loadStatsFromS3(store.state.loginUser)
  setupStats(stats)
}
const selectYear = (year: number) => {
  ;(async () => {
    const loader = $loading.show()

    try {
      await setup(year)
    } catch (error) {
      console.error(error)
      store.state.errors.push('Failed to load the state of year.')
    } finally {
      loader.hide()
    }
  })()
}
</script>

<template>
  <ContentTitle title="Statistics" />
  <YearsSelect :start-year="startYear" @select-year="selectYear" />
  <StatsTable :roly-poly-counts="rolyPolyCounts" :other-counts="otherCounts" />
</template>

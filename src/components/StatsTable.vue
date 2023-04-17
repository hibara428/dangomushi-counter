<script setup lang="ts">
import RolyPolyStatsTable, { type RolyPolyStatsProps } from '@/components/RolyPolyStatsTable.vue'
import OtherStatsTable, { type OtherStatsProps } from '@/components/OtherStatsTable.vue'

// interfaces
export interface StatsTableProps {
  rolyPolyStats: RolyPolyStatsProps
  otherStats: OtherStatsProps
}
// props
withDefaults(defineProps<StatsTableProps>(), {
  rolyPolyStats: () => ({
    eastCount: 0,
    westCount: 0,
    southCount: 0,
    northCount: 0
  }),
  otherStats: () => ({
    dogCount: 0,
    catCount: 0,
    butterflyCount: 0
  })
})
</script>

<template>
  <section>
    <RolyPolyStatsTable
      :east-count="rolyPolyStats.eastCount"
      :west-count="rolyPolyStats.westCount"
      :south-count="rolyPolyStats.southCount"
      :north-count="rolyPolyStats.northCount"
    />
    <OtherStatsTable
      :dog-count="otherStats.dogCount"
      :cat-count="otherStats.catCount"
      :butterfly-count="otherStats.butterflyCount"
    />
  </section>
</template>

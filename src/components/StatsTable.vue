<script setup lang="ts">
import RolyPolyStatsTable from '@/components/RolyPolyStatsTable.vue'
import OtherStatsTable from '@/components/OtherStatsTable.vue'
import type { DirectionCounts, OtherCounts } from '@/utils/stats'

// interfaces
export interface StatsTableProps {
  rolyPolyCounts: DirectionCounts
  otherCounts: OtherCounts
}
// props
withDefaults(defineProps<StatsTableProps>(), {
  rolyPolyCounts: () => ({
    east: 0,
    west: 0,
    south: 0,
    north: 0
  }),
  otherCounts: () => ({
    dog: 0,
    cat: 0,
    butterfly: 0
  })
})
</script>

<template>
  <section>
    <RolyPolyStatsTable :counts="rolyPolyCounts" />
    <OtherStatsTable :counts="otherCounts" />
  </section>
</template>

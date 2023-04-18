<script setup lang="ts">
import RolyPolyCountsTable from '@/components/RolyPolyCountsTable.vue'
import OtherCountsTable from '@/components/OtherCountsTable.vue'
import type { DirectionCounts, OtherCounts } from '@/utils/stats'

// interfaces
export interface DailyCountsTableProps {
  rolyPolyCounts: DirectionCounts
  otherCounts: OtherCounts
}
// props
withDefaults(defineProps<DailyCountsTableProps>(), {
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
    <RolyPolyCountsTable :counts="rolyPolyCounts" />
    <OtherCountsTable :counts="otherCounts" />
  </section>
</template>

<script setup lang="ts">
import RolyPolyCountsTable, { type RolyPolyCountsProps } from '@/components/RolyPolyCountsTable.vue'
import OtherCountsTable, { type OtherCountsProps } from '@/components/OtherCountsTable.vue'

// interfaces
export interface DailyCountsTableProps {
  rolyPolyCounts: RolyPolyCountsProps
  otherCounts: OtherCountsProps
}
// props
withDefaults(defineProps<DailyCountsTableProps>(), {
  rolyPolyCounts: () => ({
    eastCount: 0,
    westCount: 0,
    southCount: 0,
    northCount: 0
  }),
  otherCounts: () => ({
    dogCount: 0,
    catCount: 0,
    butterflyCount: 0
  })
})
</script>

<template>
  <section>
    <RolyPolyCountsTable
      :east-count="rolyPolyCounts.eastCount"
      :west-count="rolyPolyCounts.westCount"
      :south-count="rolyPolyCounts.southCount"
      :north-count="rolyPolyCounts.northCount"
    />
    <OtherCountsTable
      :dog-count="otherCounts.dogCount"
      :cat-count="otherCounts.catCount"
      :butterfly-count="otherCounts.butterflyCount"
    />
  </section>
</template>

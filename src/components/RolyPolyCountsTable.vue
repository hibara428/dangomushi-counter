<script setup lang="ts">
import type { DirectionCounts } from '@/utils/stats'
import { computed } from 'vue'

// interfaces
export interface RolyPolyCountsProps {
  counts: DirectionCounts
}
// props
const props = withDefaults(defineProps<RolyPolyCountsProps>(), {
  counts: () => ({
    east: 0,
    west: 0,
    south: 0,
    north: 0
  })
})
// computed
const sum = computed(() => {
  return props.counts.east + props.counts.west + props.counts.south + props.counts.north
})
</script>

<template>
  <h5>
    Roly-Poly<img
      src="@/assets/img/roly-poly.png"
      alt=""
      width="30"
      height="24"
      class="d-inline-block align-text-top"
    />
  </h5>

  <table class="table">
    <thead>
      <tr class="table-primary">
        <th scope="col">東</th>
        <th scope="col">西</th>
        <th scope="col">南</th>
        <th scope="col">北</th>
        <th scope="col">計</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td id="east-count">{{ counts.east }}</td>
        <td id="west-count">{{ counts.west }}</td>
        <td id="south-count">{{ counts.south }}</td>
        <td id="north-count">{{ counts.north }}</td>
        <td id="sum-count" class="table-warning fw-bold">{{ sum }}</td>
      </tr>
    </tbody>
  </table>
</template>

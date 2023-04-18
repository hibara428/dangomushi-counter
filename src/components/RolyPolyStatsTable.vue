<script setup lang="ts">
import type { DirectionCounts } from '@/utils/stats'
import { computed } from 'vue'

// interfaces
export interface RolyPolyStatsProps {
  counts: DirectionCounts
}
// props
const props = withDefaults(defineProps<RolyPolyStatsProps>(), {
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
const eastRatio = computed(() => {
  return sum.value > 0 ? Math.round((props.counts.east / sum.value) * 100) : 0
})
const westRatio = computed(() => {
  return sum.value > 0 ? Math.round((props.counts.west / sum.value) * 100) : 0
})
const southRatio = computed(() => {
  return sum.value > 0 ? Math.round((props.counts.south / sum.value) * 100) : 0
})
const northRatio = computed(() => {
  return sum.value > 0 ? Math.round((props.counts.north / sum.value) * 100) : 0
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
        <th scope="col">方角</th>
        <th scope="col">累積</th>
        <th scope="col">累積比</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">東</th>
        <td id="east-count">{{ counts.east }}</td>
        <td id="east-ratio">{{ eastRatio }}%</td>
      </tr>
      <tr>
        <th scope="row">西</th>
        <td id="west-count">{{ counts.west }}</td>
        <td id="west-ratio">{{ westRatio }}%</td>
      </tr>
      <tr>
        <th scope="row">南</th>
        <td id="south-count">{{ counts.south }}</td>
        <td id="south-ratio">{{ southRatio }}%</td>
      </tr>
      <tr>
        <th scope="row">北</th>
        <td id="north-count">{{ counts.north }}</td>
        <td id="north-ratio">{{ northRatio }}%</td>
      </tr>
      <tr class="table-warning">
        <th scope="row">計</th>
        <td id="sum">{{ sum }}</td>
        <td>100%</td>
      </tr>
    </tbody>
  </table>
</template>

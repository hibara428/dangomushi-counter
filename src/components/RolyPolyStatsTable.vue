<script setup lang="ts">
import { computed } from 'vue'

// interfaces
export interface RolyPolyStatsProps {
  eastCount: number
  westCount: number
  southCount: number
  northCount: number
}
// props
const props = withDefaults(defineProps<RolyPolyStatsProps>(), {
  eastCount: 0,
  westCount: 0,
  southCount: 0,
  northCount: 0
})
// computed
const sum = computed(() => {
  return props.eastCount + props.westCount + props.southCount + props.northCount
})
const eastRatio = computed(() => {
  return sum.value > 0 ? Math.round((props.eastCount / sum.value) * 100) : 0
})
const westRatio = computed(() => {
  return sum.value > 0 ? Math.round((props.westCount / sum.value) * 100) : 0
})
const southRatio = computed(() => {
  return sum.value > 0 ? Math.round((props.southCount / sum.value) * 100) : 0
})
const northRatio = computed(() => {
  return sum.value > 0 ? Math.round((props.northCount / sum.value) * 100) : 0
})
</script>

<template>
  <h5>Roly-Poly</h5>
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
        <td id="east-count">{{ eastCount }}</td>
        <td id="east-ratio">{{ eastRatio }}%</td>
      </tr>
      <tr>
        <th scope="row">西</th>
        <td id="west-count">{{ westCount }}</td>
        <td id="west-ratio">{{ westRatio }}%</td>
      </tr>
      <tr>
        <th scope="row">南</th>
        <td id="south-count">{{ southCount }}</td>
        <td id="south-ratio">{{ southRatio }}%</td>
      </tr>
      <tr>
        <th scope="row">北</th>
        <td id="north-count">{{ northCount }}</td>
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

<script setup lang="ts">
import { computed } from 'vue'

// interfaces
export interface RolyPolyCountsProps {
  eastCount: number
  westCount: number
  southCount: number
  northCount: number
}
// props
const props = withDefaults(defineProps<RolyPolyCountsProps>(), {
  eastCount: 0,
  westCount: 0,
  southCount: 0,
  northCount: 0
})
// computed
const sum = computed(() => {
  return props.eastCount + props.westCount + props.southCount + props.northCount
})
</script>

<template>
  <h5>Roly-Poly</h5>
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
        <td id="east-count">{{ eastCount }}</td>
        <td id="west-count">{{ westCount }}</td>
        <td id="south-count">{{ southCount }}</td>
        <td id="north-count">{{ northCount }}</td>
        <td id="sum-count" class="table-warning fw-bold">{{ sum }}</td>
      </tr>
    </tbody>
  </table>
</template>

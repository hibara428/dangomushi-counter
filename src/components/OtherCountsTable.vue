<script setup lang="ts">
// interfaces
export interface OtherCountsProps {
  dogCount: number
  catCount: number
}
// props
defineProps<OtherCountsProps>()
</script>

<template>
  <h5>Others</h5>
  <table class="table">
    <thead>
      <tr class="table-primary">
        <th scope="col">犬</th>
        <th scope="col">猫</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td id="dog-count">{{ dogCount }}</td>
        <td id="cat-count">{{ catCount }}</td>
      </tr>
    </tbody>
  </table>
</template>

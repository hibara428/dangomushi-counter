<script setup lang="ts">
// interfaces
export interface OtherStatsProps {
  dogCount: number
  catCount: number
}
// props
withDefaults(defineProps<OtherStatsProps>(), {
  dogCount: 0,
  catCount: 0
})
</script>

<template>
  <h5>Others🐕🐈</h5>
  <table class="table">
    <thead>
      <tr class="table-primary">
        <th scope="col">名前</th>
        <th scope="col">計</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">犬🐕</th>
        <td id="dog-total">{{ dogCount }}</td>
      </tr>
      <tr>
        <th scope="row">猫🐈</th>
        <td id="cat-total">{{ catCount }}</td>
      </tr>
    </tbody>
  </table>
</template>

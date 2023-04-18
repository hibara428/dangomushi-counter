<script setup lang="ts">
import type { OtherCounts } from '@/utils/stats'

// interfaces
export interface OtherStatsProps {
  counts: OtherCounts
}
// props
withDefaults(defineProps<OtherStatsProps>(), {
  counts: () => ({
    dog: 0,
    cat: 0,
    butterfly: 0
  })
})
</script>

<template>
  <h5>Others🐕🐈🦋</h5>
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
        <td id="dog-total">{{ counts.dog }}</td>
      </tr>
      <tr>
        <th scope="row">猫🐈</th>
        <td id="cat-total">{{ counts.cat }}</td>
      </tr>
      <tr>
        <th scope="row">蝶🦋</th>
        <td id="butterfly-total">{{ counts.butterfly }}</td>
      </tr>
    </tbody>
  </table>
</template>

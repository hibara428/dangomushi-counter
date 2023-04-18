<script setup lang="ts">
// interfaces
export interface YearsSelectProps {
  startYear: number
}
// props
const props = withDefaults(defineProps<YearsSelectProps>(), {
  startYear: 2022
})
// data
const years: number[] = []
for (let year = new Date().getFullYear(); year >= props.startYear; year--) {
  years.push(year)
}
// emits
const emits = defineEmits<{
  (event: 'select-year', year: number): void
}>()
const selectYear = (event: Event) => {
  if (event.target instanceof HTMLSelectElement) {
    emits('select-year', Number(event.target.value))
  }
}
</script>

<template>
  <section class="my-3">
    <div class="form-group">
      <select class="form-control form-select" @change="selectYear">
        <option value="" selected>Select Year</option>
        <option v-for="year in years" :key="year" v-bind:value="year">{{ year }}</option>
      </select>
    </div>
  </section>
</template>

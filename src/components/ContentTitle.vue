<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <section class="title">
    <h2>{{ title }}</h2>
  </section>
</template>

<style scoped>
.title h2 {
  margin: 1rem 0;
}
</style>

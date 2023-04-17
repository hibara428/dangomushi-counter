<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <section class="title">
    <div class="container-fluid">
      <h2>{{ title }}</h2>
    </div>
  </section>
</template>

<style scoped>
.title h2 {
  margin: 1rem 0;
}
</style>

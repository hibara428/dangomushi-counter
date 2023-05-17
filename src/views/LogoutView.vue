<script setup lang="ts">
import ContentTitle from '@/components/ContentTitle.vue'
import { removeCookies } from '@/utils/cognito'

// Remove coginito cookies.
removeCookies()
</script>

<template>
  <ContentTitle title="Logout" />
  <a href="/">Re-Login</a>
</template>

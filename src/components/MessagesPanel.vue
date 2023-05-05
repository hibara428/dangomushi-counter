<script setup lang="ts">
import { useStore } from 'vuex'
import { key } from '@/stores'

const store = useStore(key)
const errors = store.state.errors
const messages = store.state.messages
</script>

<template>
  <section>
    <div
      v-for="error in errors"
      :key="error"
      id="alert-error"
      class="alert alert-danger alert-dismmisable fade show"
      :class="[errors.length > 0 ? 'alert-show' : 'alert-hidden']"
      role="alert"
    >
      {{ error }}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <div
      v-for="message in messages"
      :key="message"
      id="alert-message"
      class="alert alert-success alert-dismmisable fade show"
      :class="[messages.length > 0 ? 'alert-show' : 'alert-hidden']"
      role="alert"
    >
      {{ message }}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.alert-show {
  border-radius: 0;
  display: block;
  margin: 0;
}
.alert-hidden {
  border-radius: 0;
  display: none;
  margin: 0;
}
</style>

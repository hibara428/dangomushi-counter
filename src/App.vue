<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import MessagesPanel from '@/components/MessagesPanel.vue'
import { useStore } from 'vuex'
import { key } from '@/stores'
import { CognitoCookieParser } from './utils/cognito'

const store = useStore(key)
if (store.state.loginUser === undefined) {
  const userPoolAppClientId = import.meta.env.VITE_USER_POOL_APP_CLIENT_ID || ''
  const cognitoUser = new CognitoCookieParser().parse(userPoolAppClientId)
  store.state.loginUser = cognitoUser
}
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <a class="navbar-brand" href="/">
        <img
          src="@/assets/img/roly-poly.png"
          alt="roly-poly"
          width="30"
          height="24"
          class="d-inline-block align-text-top"
        />
        Counter
      </a>

      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/stats" class="nav-link">Stats</RouterLink>
          </li>
        </ul>
      </div>
    </nav>

    <MessagesPanel />
  </header>

  <main class="my-2">
    <div class="container-fluid">
      <RouterView />
    </div>
  </main>

  <footer class="border-top py-2">
    <div class="container-fluid">
      ©︎2022 <a href="https://github.com/hibara428">hibara428</a> / v0.3.0
    </div>
  </footer>
</template>

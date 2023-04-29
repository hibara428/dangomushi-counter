import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  interface State {
    errors: string[]
    messages: string[]
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}

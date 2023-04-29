import type { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

export interface State {
  errors: string[]
  messages: string[]
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    errors: [],
    messages: []
  }
})

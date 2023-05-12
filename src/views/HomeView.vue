<script setup lang="ts">
import { reactive } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/stores'
import ContentTitle from '@/components/ContentTitle.vue'
import DailyCountsTable from '@/components/DailyCountsTable.vue'
import CounterPanel from '@/components/CounterPanel.vue'
import {
  Stats,
  loadStatsFromS3,
  saveStatsToS3,
  type DirectionCounts,
  type OtherCounts
} from '@/utils/stats'
import { useLoading } from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

// data
const store = useStore(key)
let rolyPolyCounts: DirectionCounts = reactive({
  east: 0,
  west: 0,
  south: 0,
  north: 0
})
let otherCounts: OtherCounts = reactive({
  dog: 0,
  cat: 0,
  butterfly: 0
})
const $loading = useLoading({ isFullPage: true })
// methods
/**
 * カウンタリセット
 */
const reset = () => {
  rolyPolyCounts.east = 0
  rolyPolyCounts.west = 0
  rolyPolyCounts.south = 0
  rolyPolyCounts.north = 0
  otherCounts.dog = 0
  otherCounts.cat = 0
  otherCounts.butterfly = 0
}
/**
 * カウントアップ
 * @param label
 */
const countUp = (label: string) => {
  switch (label) {
    case 'east':
      rolyPolyCounts.east++
      break
    case 'west':
      rolyPolyCounts.west++
      break
    case 'south':
      rolyPolyCounts.south++
      break
    case 'north':
      rolyPolyCounts.north++
      break
    case 'dog':
      if (!otherCounts.dog) {
        otherCounts.dog = 0
      }
      otherCounts.dog++
      break
    case 'cat':
      if (!otherCounts.cat) {
        otherCounts.cat = 0
      }
      otherCounts.cat++
      break
    case 'butterfly':
      if (!otherCounts.butterfly) {
        otherCounts.butterfly = 0
      }
      otherCounts.butterfly++
      break
  }
}
/**
 * 統計データの変換
 */
const convertDataToStats = (): Stats => {
  return new Stats(
    {
      east: rolyPolyCounts.east,
      west: rolyPolyCounts.west,
      south: rolyPolyCounts.south,
      north: rolyPolyCounts.north
    },
    {
      dog: otherCounts.dog || 0,
      cat: otherCounts.cat || 0,
      butterfly: otherCounts.butterfly || 0
    }
  )
}
/**
 * 記録終了
 */
const endCount = () => {
  ;(async () => {
    const loader = $loading.show()
    try {
      if (!store.state.loginUser) {
        throw new Error('Login user is not found.')
      }

      let stats: Stats = convertDataToStats()
      let isNew = false

      try {
        // 累積データの取得
        const beforeStats = await loadStatsFromS3(store.state.loginUser)
        // 累積データとのマージ
        stats = beforeStats.merge(stats)
      } catch (error) {
        isNew = true
      }
      // 累積データの保存
      await saveStatsToS3(store.state.loginUser, stats)
      store.state.messages.push('Saved!' + (isNew ? ' (New creation)' : ''))
      // カウンタリセット
      reset()
    } catch (error) {
      console.error(error)
      store.state.errors.push('Failed to save the state.')
    } finally {
      loader.hide()
    }
  })()
}
</script>

<template>
  <ContentTitle title="Daily Counter" />
  <DailyCountsTable :roly-poly-counts="rolyPolyCounts" :other-counts="otherCounts" />
  <CounterPanel @count-up="countUp" @end-count="endCount" />
</template>

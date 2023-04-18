<script setup lang="ts">
// emits
const emits = defineEmits<{
  (event: 'count-up', label: string): void
  (event: 'end-count'): void
}>()
/**
 * カウントアップ
 * @param label
 */
const countUp = (label: string) => {
  emits('count-up', label)
}
/**
 * 記録終了
 */
const endCount = () => {
  emits('end-count')
}
</script>

<template>
  <section class="fixed-bottom d-flex bg-light border-top align-items-center">
    <div class="container-fluid">
      <div class="collapse" id="collapseBottomForm">
        <div class="mt-3 mb-2">
          <div class="row my-2">
            <div class="col-8 d-grid gap-2 mx-auto">
              <button
                type="button"
                class="btn btn-lg btn-block btn-primary"
                @click="countUp('south')"
              >
                南
              </button>
            </div>
          </div>
          <div class="row my-2">
            <div class="col d-grid gap-2 mx-auto">
              <button
                type="button"
                class="btn btn-lg btn-block btn-primary"
                @click="countUp('east')"
              >
                東
              </button>
            </div>
            <div class="col d-grid gap-2 mx-auto">
              <button
                type="button"
                class="btn btn-lg btn-block btn-primary"
                @click="countUp('west')"
              >
                西
              </button>
            </div>
          </div>
          <div class="row my-2">
            <div class="col-8 d-grid gap-2 mx-auto">
              <button
                type="button"
                class="btn btn-lg btn-block btn-primary"
                @click="countUp('north')"
              >
                北
              </button>
            </div>
          </div>
        </div>
        <div class="row my-3">
          <div class="col d-grid gap-2">
            <div class="container-fluid px-0">
              <div class="row">
                <div class="col d-grid gap-2 mx-auto">
                  <button
                    type="button"
                    class="btn btn-lg btn-block btn-success"
                    @click="countUp('dog')"
                  >
                    犬
                  </button>
                </div>
                <div class="col d-grid gap-2 mx-auto">
                  <button
                    type="button"
                    class="btn btn-lg btn-block btn-success"
                    @click="countUp('cat')"
                  >
                    猫
                  </button>
                </div>
                <div class="col d-grid gap-2 mx-auto">
                  <button
                    type="button"
                    class="btn btn-lg btn-block btn-success"
                    @click="countUp('butterfly')"
                  >
                    蝶
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row my-3">
          <div class="col d-grid gap-2">
            <button type="button" class="btn btn-lg btn-block btn-danger" @click="endCount()">
              計測終了
            </button>
          </div>
        </div>
      </div>

      <div class="row">
        <a
          class="btn btn-lg btn-secondary btn-block"
          data-toggle="collapse"
          href="#collapseBottomForm"
          role="button"
          aria-expanded="false"
          aria-controls="collapseBottomForm"
        >
          Show/Hide Controls
        </a>
      </div>
    </div>
  </section>
</template>

<template>
  <article class="contents-wrap" :id="id">
    <div class="tit-wrap">
      <h1 class="h1-tit">{{ title }}</h1>
      <div v-if="depth" class="directory-wrap">
        <span>{{ depth }}</span>
        <i><img src="@/assets/arrow_right.svg" alt="디렉토리목록" /></i>
        <span>{{ title }}</span>
      </div>
    </div>
    <div class="box comp">
      <div class="box-tit">
        <h2 class="h2-tit">{{ subTitle }}</h2>
        <em class="script" v-if="isEmShow && !isShowProgress">{{ $t('common.necessary_input') }}</em>
        <div class="text-center">
          <b-spinner v-show="isShowProgress" label="Large Spinner"></b-spinner>
        </div>
      </div>
      <div class="form-wrap">
        <slot name="contents"></slot>
      </div>
      <slot name="buttons"></slot>
    </div>
  </article>
</template>

<script setup lang="ts">
import { BSpinner } from 'bootstrap-vue-3';
import { ref, reactive, computed, watch, onMounted } from 'vue';
import type { Ref } from 'vue';

const props = defineProps<{
  title?: string | null;
  subTitle?: string | null;
  depth?: string | null;
  isShowProgress?: boolean;
  id?: string | undefined;
  isEmShow?: boolean;
}>();
// const emit = defineEmits<{
//   (e: 'input', value: any): void;
//   (e: 'submit'): void;
// }>();
</script>

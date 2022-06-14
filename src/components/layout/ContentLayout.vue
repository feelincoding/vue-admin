<template>
  <div :id="id">
    <div class="tit-wrap">
      <h1 class="h1-tit">{{ title }}</h1>
      <div v-if="depth" class="directory-wrap">
        <span>{{ depth }}</span>
        <i><img src="@/assets/arrow_right.svg" alt="디렉토리목록" /></i>
        <span>{{ title }}</span>
      </div>
    </div>
    <section class="contents-wrap box">
      <div class="box-tit" v-if="$route.path.includes('register') || $route.path.includes('edit')">
        <em class="script">필수 입력사항 입니다.</em>
      </div>
      <slot name="contents"></slot>
    </section>
    <slot name="buttons"></slot>
  </div>
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

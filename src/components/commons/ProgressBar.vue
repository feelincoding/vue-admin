<template>
  <b-progress class="w-25" style="border-radius: 10px">
    <b-progress-bar
      :value="progressBar.sucesCnt"
      :max="progressBar.totCnt"
      :label="progressBar.sucesRate + '%'"
      :animated="true"
      :variant="progressBar.sucesRate >= 80 ? 'primary' : progressBar.sucesRate >= 50 ? 'warning' : 'danger'"
      style="border-radius: 10px; background-color: #6998ff"
    ></b-progress-bar>
  </b-progress>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';

import type { ApiStat } from '@/types/MonitoringControlType';
const props = defineProps({
  listItem: {
    type: Object,
    default: {} as ApiStat,
  },
  syncedIsCommError: {
    type: Boolean,
    default: false,
  },
});

const progressBar: Ref<ApiStat> = ref({} as ApiStat);

onMounted(() => {
  progressBar.value = props.listItem as ApiStat;
});
</script>

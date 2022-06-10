<template>
  <div class="chart-wrap">
    <h3 class="h3-tit">{{ $t('dash-board.service_top5_title') }}</h3>

    <ul class="list-wrap" style="margin-bottom: 0">
      <ErrorWrapper v-show="syncedIsCommError" />
      <li v-for="(item, index) in top5List" :key="index">
        <p class="id-txt">{{ item.svcId }}</p>
        <dl>
          <dt>
            <em>{{ $t('common.total') }} :</em>{{ item.totCnt }}
          </dt>
          <dd>
            <span class="syan">{{ item.sucesCnt }}</span
            >/<span class="red">{{ item.failCnt }}</span>
          </dd>
        </dl>
        <div class="sm-bar">{{ $t('dash-board.success_rate') }}</div>
        <ProgressBar :listItem="item" />
        <button class="more-btn" @click="(showApiDetailModal = true), (serviceDetailData = item), clickModalBtn(item)">
          <i><img src="@/assets/more_ico.svg" :alt="$t('common.more')" /></i>
        </button>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import ProgressBar from '@/components/commons/ProgressBar.vue';
import type { ServiceStat } from '@/types/DashBoardType';
import ErrorWrapper from '@/components/dash-board/ErrorWrapper.vue';

const props = defineProps({
  realTimeStat: {
    type: Object,
    default: () => ({}),
  },
  syncedIsCommError: {
    type: Boolean,
    default: false,
  },
});

const serviceDetailData: Ref<ServiceStat> = ref({} as ServiceStat);
const top5List: Ref<ServiceStat[]> = ref([]);
const showApiDetailModal = ref(false);

watch(
  () => props.realTimeStat,
  () => {
    console.log('ccs', props.realTimeStat.svcStat);
    top5List.value = props.realTimeStat.svcStat
      .sort((a: { totCnt: number }, b: { totCnt: number }) => b.totCnt - a.totCnt)
      .slice(0, 5);
  }
);

const emit = defineEmits<{
  (e: 'clickModalBtn', value: ServiceStat | null): void;
}>();
const clickModalBtn = (item: ServiceStat) => {
  emit('clickModalBtn', item);
};
</script>

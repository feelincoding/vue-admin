<template>
  <div class="chart-wrap">
    <h3 class="h3-tit">{{ $t('dash-board.api_top5_title') }}</h3>
    <ul class="list-wrap">
      <ErrorWrapper v-show="syncedIsCommError" />
      <li v-for="(item, index) in top5List" :key="index">
        <p class="id-txt">{{ item.sysId }}.{{ item.apiId }}</p>
        <dl>
          <dt><em>Total :</em>{{ item.totCnt }}</dt>
          <dd>
            <span class="syan">{{ item.sucesCnt }}</span
            >/<span class="red">{{ item.failCnt }}</span>
          </dd>
        </dl>
        <div class="sm-bar">{{ $t('dash-board.success_rate') }}</div>
        <ProgressBar :listItem="item" />
        <button class="more-btn" @click="(isShowModal = true), (apiDetailData = item), clickModalBtn(item)">
          <i><img src="@/assets/more_ico.svg" :alt="$t('common.more')" /></i>
        </button>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import ProgressBar from '@/components/commons/ProgressBar.vue';
import ErrorWrapper from '@/components/dash-board/ErrorWrapper.vue';
import type { ApiStat } from '@/types/DashBoardType';

const props = defineProps({
  realTimeStat: {
    type: Object,
    default: {} as ApiStat,
  },
  syncedIsCommError: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits<{
  (e: 'clickModalBtn', value: ApiStat | null): void;
}>();

const apiDetailData: Ref<ApiStat> = ref({} as ApiStat);
const top5List: Ref<ApiStat[]> = ref([]);
const isShowModal = ref(false);

watch(
  () => props.realTimeStat,
  () => {
    top5List.value = props.realTimeStat.apiStat
      .sort((a: { totCnt: number }, b: { totCnt: number }) => b.totCnt - a.totCnt)
      .slice(0, 5);
  }
);

const clickModalBtn = (item: ApiStat) => {
  emit('clickModalBtn', item);
};
</script>

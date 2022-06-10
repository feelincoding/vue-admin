<template>
  <li>
    <div class="list-comp">
      <div class="stati-group">
        <h4 class="h4-tit">{{ item.sysId }}.{{ item.apiId }}</h4>
        <div class="other-cont">
          <div class="stick-cont">
            <span class="stick minor" v-if="errorLevels.MI"></span>
            <span class="stick major" v-if="errorLevels.MA"></span>
            <span class="stick critical" v-if="errorLevels.CR"></span>
          </div>

          <span class="text"
            >{{ $t('common.total') }} : <em class="purple">{{ item.totCnt }}</em></span
          >
          <span class="text"
            >{{ $t('common.success_eng') }} : <em class="syan">{{ item.sucesCnt }}</em></span
          >
          <span class="text"
            >{{ $t('common.fail_eng') }} : <em class="red">{{ item.failCnt }}</em></span
          >

          <span class="success"
            ><em>{{ item.sucesRate }}</em
            >%</span
          >
        </div>
      </div>

      <button
        v-if="kind === 'svc' ? true : false"
        class="more-btn"
        @click="showStatiDetailBlock = !showStatiDetailBlock"
      >
        <i
          ><img :src="showStatiDetailBlock ? dropUp : dropDown" :alt="$t('common.more')" :title="$t('common.more')"
        /></i>
      </button>
    </div>
    <div class="stati-detail block" v-if="showStatiDetailBlock">
      <div class="result-group">
        <div class="comp">
          <label class="badge syan">{{ $t('common.success_eng') }}</label>
          <span class="text">{{ item.sucesCnt }}</span>
        </div>
      </div>

      <div class="result-group">
        <div class="comp">
          <label class="badge red">{{ $t('common.fail_eng') }}</label>
          <span class="text">{{ item.failCnt }}</span>
        </div>

        <div class="comp" v-if="errorCheck">
          <ul class="error-list">
            <li
              v-for="(api, index) in item.rsltStat[startIndex].errStat"
              :key="index"
              :class="{
                minor: api.errLevel == 'MI',
                major: api.errLevel == 'MA',
                critical: api.errLevel == 'CR',
              }"
            >
              <span class="text"
                ><strong>{{ api.errCd }}</strong> {{ api.errMsg }}</span
              >
              <span class="text ml10"
                >[<strong>{{ api.totCnt }}</strong
                >]</span
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </li>
</template>
<script setup lang="ts">
import { ref, type Ref } from 'vue';

import type { StatiApiStat } from '@/types/MonitoringStatisticType';

import dropUp from '@/assets/dropup_ico.svg';
import dropDown from '@/assets/dropdown_ico.svg';

interface ErrorLevels {
  MI: boolean;
  MA: boolean;
  CR: boolean;
}

const props = defineProps<{
  kind: string;
  item: StatiApiStat;
}>();

const errorLevels: Ref<ErrorLevels> = ref({
  CR: false,
  MA: false,
  MI: false,
});

const showStatiDetailBlock = ref(false);
const errorCheck = ref(false);
const startIndex = ref(0);

if (props.kind === 'api') {
  showStatiDetailBlock.value = true;
}
// console.log('ApiDetailModalApiList: ', item);
for (let i = 0; i < props.item.rsltStat.length; i++) {
  if (props.item.rsltStat[i].rsltType === 'F') {
    errorCheck.value = true;
    startIndex.value = i;
    for (let i = 0; i < props.item.rsltStat[startIndex.value].errStat.length; i++) {
      if (props.item.rsltStat[startIndex.value].errStat[i].errLevel === undefined) {
        props.item.rsltStat[startIndex.value].errStat[i].errLevel = 'MA';
      }
      const temp: 'CR' | 'MA' | 'MI' = props.item.rsltStat[startIndex.value].errStat[i].errLevel as 'CR' | 'MA' | 'MI';
      errorLevels.value[temp] = true;
    }
  }
}
</script>

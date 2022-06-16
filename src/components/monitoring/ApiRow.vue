<template>
  <li>
    <div class="list-comp" @click="onClickRow">
      <div class="stati-group">
        <h4 class="h4-tit">{{ apiList.sysId }}.{{ apiList.apiId }}</h4>
        <div class="other-cont">
          <div class="stick-cont">
            <span
              v-for="(err, index) in errList"
              :key="index"
              :class="{ critical: err == 'CR', major: err == 'MA', minor: err == 'MI' }"
              class="stick"
            ></span>
          </div>

          <span class="text"
            >Total : <em>{{ numberWithCommas(apiList.totCnt) }}</em></span
          >
          <span class="text"
            >Success : <em class="syan">{{ numberWithCommas(apiList.sucesCnt) }}</em></span
          >
          <span class="text"
            >Fail : <em class="red">{{ numberWithCommas(apiList.failCnt) }}</em></span
          >

          <span class="success"
            ><em>{{ apiList.sucesRate }}</em
            >%</span
          >
        </div>
      </div>

      <button class="more-btn">
        <i v-if="!isOpen"><img src="@/assets/dropdown_ico.svg" alt="닫기" title="닫기" /></i>
        <i v-if="isOpen"><img src="@/assets/dropup_ico.svg" alt="더보기" title="더보기" /></i>
      </button>
    </div>

    <div class="stati-detail block" :class="{ 'list-slider': isOpen, 'list-slider-none': !isOpen }">
      <div class="result-group">
        <div class="comp">
          <label class="badge syan">Success</label>
          <span class="text">{{ numberWithCommas(apiList.sucesCnt) }}</span>
        </div>
      </div>

      <div class="result-group">
        <div class="comp">
          <label class="badge red">Fail</label>
          <span class="text">{{ numberWithCommas(apiList.failCnt) }}</span>
        </div>

        <div class="comp">
          <ul class="error-list" v-for="(rsltStat, index) in apiList.rsltStat" :key="index">
            <li
              v-for="(err, index2) in rsltStat.errStat"
              :key="index2"
              :class="{
                critical: err.errLevel == 'CR',
                major: err.errLevel == 'MA',
                minor: err.errLevel == 'MI',
              }"
            >
              <span class="text"
                ><strong>{{ err.errCd }}</strong> {{ err.errMsg }}</span
              >
              <span class="text ml10"
                >[<strong>{{ numberWithCommas(err.totCnt) }}</strong
                >]</span
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- // api -->
  </li>
</template>
<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import type { StatiApiStat } from '@/types/MonitoringStatisticType';
import { numberWithCommas } from '@/utils/validation';
const props = defineProps<{
  apiList: StatiApiStat;
}>();
const errList: Ref<string[]> = ref([]);
const isOpen = ref(false);

onMounted(() => {
  props.apiList.rsltStat.map((rslt) => {
    rslt.errStat.map((err) => {
      if (!errList.value.includes(err.errLevel)) errList.value.push(err.errLevel);
    });
  });
});

function onClickRow() {
  isOpen.value = !isOpen.value;
}
</script>

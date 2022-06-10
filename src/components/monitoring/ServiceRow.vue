<template>
  <li>
    <div class="list-comp list" @click="onClickRow">
      <div class="stati-service">
        <h4 class="h4-tit">{{ svcList.svcId }}</h4>
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
            >Total : <em class="purple">{{ svcList.totCnt }}</em></span
          >
          <span class="text"
            >Success : <em class="syan">{{ svcList.sucesCnt }}</em></span
          >
          <span class="text"
            >Fail : <em class="red">{{ svcList.failCnt }}</em></span
          >

          <span class="success"
            ><em>{{ svcList.sucesRate }}</em
            >%</span
          >
        </div>
      </div>

      <button class="more-btn">
        <i v-if="!isOpen"><img src="@/assets/dropdown_ico.svg" alt="닫기" title="닫기" /></i>
        <i v-if="isOpen"><img src="@/assets/dropup_ico.svg" alt="더보기" title="더보기" /></i>
      </button>
    </div>
    <!-- //service -->

    <div class="stati-list" :class="{ 'list-slider': isOpen, 'list-slider-none': !isOpen }">
      <!-- api list -->
      <ul>
        <ApiRow v-for="(item, index) in svcList.apiStat" :key="index" :apiList="item" />
      </ul>
    </div>
    <!-- // api list -->
  </li>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, type Ref } from 'vue';
import type { StatiSvcStat } from '@/types/MonitoringStatisticType';
import ApiRow from './ApiRow.vue';
const props = defineProps<{
  svcList: StatiSvcStat;
}>();

const errList: Ref<string[]> = ref([]);

onMounted(() => {
  props.svcList.apiStat.map((api) => {
    api.rsltStat.map((rslt) => {
      rslt.errStat.map((err) => {
        if (!errList.value.includes(err.errLevel)) errList.value.push(err.errLevel);
      });
    });
  });
});

const isOpen = ref(false);
function onClickRow() {
  isOpen.value = !isOpen.value;
}
</script>
<style scoped>
.list {
  background-color: white;
  height: auto;
}
.list-slider {
  transform-origin: top;
  height: fit-content;
  transform: scaleY(100%);
  transition: all 0.3s ease-out;
}
.list-slider-none {
  transform-origin: top;
  height: 0;
  transform: scaleY(0%);
}
</style>

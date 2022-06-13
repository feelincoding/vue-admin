<template>
  <div class="search-wrap monitor-search key-search">
    <div class="border-cont search-cont">
      <h4 class="label-tit">{{ t('traffic.time_unit') }}</h4>
      <!-- <div class="time-group"> -->
      <div>
        <div class="sla-toggle">
          <button class="btn-toggle" :class="{ on: selectedUnit === 'MM' }" @click="selectUnit('MM')">Month</button>
          <button class="btn-toggle" :class="{ on: selectedUnit === 'DD' }" @click="selectUnit('DD')">Day</button>
          <button class="btn-toggle" :class="{ on: selectedUnit === 'HH' }" @click="selectUnit('HH')">Hour</button>
          <button class="btn-toggle" :class="{ on: selectedUnit === 'MI' }" @click="selectUnit('MI')">Min</button>
        </div>
        <!------- 월 단위 - 최대 60개월 -------->
        <!-------  일 단위 - 최대 150일 -------->
        <!-------  시간 단위 - 최대 120 시간 -------->
        <!-------  분 단위 - 최대 480 분 -------->
        <div class="date-wrap">
          <div class="date-cont bg-white-date">
            <Datepicker
              v-if="selectedUnit === 'MM'"
              v-model="month"
              range
              monthPicker
              locale="ko-KR"
              :format="monthFormat"
            />
            <Datepicker
              v-else-if="selectedUnit === 'DD'"
              range
              multiCalendars
              locale="ko-KR"
              v-model="date"
              :format="dayFormat"
              :maxDate="new Date()"
            />
            <Datepicker
              v-else-if="selectedUnit === 'HH'"
              range
              multiCalendars
              locale="ko-KR"
              v-model="date"
              :format="hourFormat"
              :maxDate="new Date()"
            />
            <Datepicker
              v-else-if="selectedUnit === 'MI'"
              range
              multiCalendars
              locale="ko-KR"
              v-model="date"
              :format="minuteFormat"
              :maxDate="new Date()"
            />
          </div>
        </div>
      </div>
    </div>

    <!------- 서비스 ID 검색 -------->
    <div class="search-cont" v-if="tab === 'service'">
      <h4 class="label-tit">{{ t('traffic.id_search') }}</h4>

      <div class="service-search">
        <div class="word-wrap">
          <div v-for="(service, index) in selectedServices" :key="index" class="api-stick">
            <span>{{ service }}</span>
            <button>
              <i @click="unselectService"><img src="@/assets/close.svg" alt="닫기" :title="service" /></i>
            </button>
          </div>
        </div>

        <div class="multi-wrap">
          <input
            id="search-focus-input"
            type="text"
            class="input-box lg search-focus-input"
            placeholder="서비스 ID 검색"
            v-model="searchText"
          />
          <button class="mid-btn" @click="handleClickSearch">
            <i><img src="@/assets/search_ico.svg" alt="검색" /></i>Search
          </button>
        </div>

        <!--  multi select -->
        <div id="search-focus-div" v-show="isFocus" class="multi-wrap search-focus-div">
          <div class="select-form">
            <!--  dropdown시 block class 추가-->
            <ul>
              <li v-for="(item, index) in serviceList" :key="index" @click="selectService">
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
        <!--  // multi select -->
      </div>
    </div>
    <!------- // 서비스 ID 검색 -------->

    <!------- API 검색 -------->
    <div class="search-cont" v-if="tab === 'api'">
      <h4 class="label-tit">{{ t('traffic.id_search') }}</h4>

      <div class="service-search">
        <div class="word-wrap">
          <div v-for="(api, index) in selectedAPI" :key="index" class="api-stick">
            <span>{{ api }}</span>
            <button>
              <i @click="unselectAPI"><img src="@/assets/close.svg" alt="닫기" :title="api" /></i>
            </button>
          </div>
        </div>

        <div class="multi-wrap">
          <input
            id="search-focus-input"
            type="text"
            class="input-box lg search-focus-input"
            placeholder="API ID 검색"
            v-model="searchText"
          />
          <button class="mid-btn" @click="handleClickSearch">
            <i><img src="@/assets/search_ico.svg" alt="검색" /></i>Search
          </button>
        </div>

        <!--  multi select -->
        <div id="search-focus-div" v-show="isFocus" class="multi-wrap search-focus-div">
          <div class="select-form">
            <!--  dropdown시 block class 추가-->
            <ul class="api-list">
              <li v-for="(system, index) in apiList" :key="index">
                <a class="stick">{{ system.sysId }}</a>
                <div class="api-group">
                  <div class="check-all">
                    <div class="check-box" @click="selectAllAPI(system.apis)">
                      <div class="check">
                        <input type="checkbox" id="checkAll" :checked="checkAllAPI(system.apis)" /><span
                          class="checkmark"
                        ></span>
                      </div>
                      <label for="checkAll">{{ $t('traffic.select_all') }}</label>
                    </div>
                  </div>
                  <div class="check-group">
                    <div class="check-box" v-for="(api, index) in system.apis" :key="index" @click="selectAPI">
                      <div class="check">
                        <input type="checkbox" :value="api" :checked="selectedAPI.includes(api)" /><span
                          class="checkmark"
                        ></span>
                      </div>
                      <label for="checkGet">{{ api }}</label>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!--  // multi select -->
      </div>
    </div>
    <!------- // 서비스 ID 검색 -------->
  </div>
</template>
<script setup lang="ts">
import type { ApiSearch } from '@/types/MonitoringStatisticType';
import { ref, reactive, computed, watch, onMounted, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n({});
const emit = defineEmits<{
  (e: 'search', value: any): void;
}>();
const props = defineProps<{
  tab: string;
  isFocus: boolean;
  propServiceList: string[] | null;
  placeholder: string;
  propApiList: ApiSearch[] | null;
}>();

const selectedUnit = ref('MM');
const startDate = ref(new Date());
const endDate = ref(new Date());
const searchText = ref('');
function selectUnit(unit: string) {
  selectedUnit.value = unit;
  startDate.value = new Date();
  endDate.value = new Date();
}

//서비스탭
const serviceList = computed(() => {
  if (props.propServiceList === null) {
    return [];
  }
  return props.propServiceList.filter((item: string) => item.toUpperCase().includes(searchText.value.toUpperCase()));
});
const selectedServices: Ref<string[]> = ref([]);
function selectService(event: any) {
  const service = event.target.innerText as string;
  if (selectedServices.value.includes(service)) {
    return;
  }
  selectedServices.value.push(service);
  selectedServices.value = selectedServices.value.sort();
}
function unselectService(event: any) {
  const service = event.target.title as string;
  selectedServices.value = selectedServices.value.filter((item: string) => item !== service);
}
// API탭
const selectedAPI: Ref<string[]> = ref([]);
const apiList = computed(() => {
  const res: ApiSearch[] = [];
  if (props.propApiList === null) {
    return res;
  }
  props.propApiList.forEach((item: { sysId: string; apis: string[] }) => {
    const apis = item.apis.filter(
      (api: string) =>
        api.toUpperCase().includes(searchText.value.toUpperCase()) ||
        item.sysId.toUpperCase().includes(searchText.value.toUpperCase())
    );
    if (apis.length > 0) {
      res.push({ sysId: item.sysId, apis: apis.map((api: string) => item.sysId + '.' + api) });
    }
  });
  return res;
});
function checkAllAPI(apis: string[]) {
  return apis.every((api: string) => selectedAPI.value.includes(api));
}

function selectAPI(event: any) {
  const api = event.target.innerText ? event.target.innerText : event.target.value;

  if (selectedAPI.value.includes(api)) {
    selectedAPI.value = selectedAPI.value.filter((item: string) => item !== api);
  } else {
    selectedAPI.value.push(api);
  }
  selectedAPI.value = selectedAPI.value.sort();
}
function selectAllAPI(apis: string[]) {
  if (checkAllAPI(apis)) {
    selectedAPI.value = selectedAPI.value.filter((item: string) => !apis.includes(item));
  } else {
    apis.map((api: string) => {
      if (!selectedAPI.value.includes(api)) {
        selectedAPI.value.push(api);
      }
    });
  }
  selectedAPI.value = selectedAPI.value.sort();
}
function unselectAPI(event: any) {
  const api = event.target.title as string;
  selectedAPI.value = selectedAPI.value.filter((item: string) => item !== api);
}

// disabledAfterTodayAndAfterEndDay(date: Date) {
//   const today = new Date();
//   const endDay = new Date(this.endDate + ' ' + (this.endTime ? this.endTime : '23:59:59'));
//   return date > today || date > endDay || this.checkMinMax(date, endDay);
// }
// disabledAfterNowOrAfterEndTime(date: Date) {
//   const now = new Date();
//   const endTime = this.endTime ? new Date(this.endDate + 'T' + this.endTime) : new Date();
//   const compDate = new Date(this.startDate + 'T' + date.toTimeString().substr(0, 8));
//   return compDate > now || compDate > endTime || (this.endTime ? this.checkMinMax(compDate, endTime) : false);
// }

// disabledAfterTodayOrBeforeStartDay(date: Date) {
//   const today = new Date();
//   const startDay = this.startDate ? new Date(this.startDate + 'T' + '00:00:00') : new Date(0);
//   return date > today || date < startDay || this.checkMinMax(startDay, date);
// }

// disabledAfterNowOrBeforeStartTime(date: Date) {
//   const now = new Date();
//   const startTime = this.startDate && this.startTime ? new Date(this.startDate + 'T' + this.startTime) : new Date(0);
//   const compDate = new Date(this.endDate + 'T' + date.toTimeString().substr(0, 8));
//   return compDate >= now || compDate <= startTime || (this.startTime ? this.checkMinMax(startTime, compDate) : false);
// }
const date: Ref<Date[]> = ref([]);
// const month: Ref<{ month: number; year: number }[]> = ref([]);
const month = ref();

// 화면에 표시될 날짜 포멧 설정
const monthFormat = (dates: { month: number; year: number }[]) => {
  return `${dates[0].year}-${dates[0].month + 1 < 10 ? '0' + (dates[0].month + 1) : dates[0].month + 1} ~ ${
    dates[1].year
  }-${dates[1].month + 1}`;
};
const dayFormat = (dates: Date[]) => {
  return `${dates[0].toISOString().slice(0, 10)} ~ ${dates[1].toISOString().slice(0, 10)}`;
};
const hourFormat = (dates: Date[]) => {
  return `${dates[0].toISOString().slice(0, 10)} ${dates[0].toTimeString().slice(0, 2)}:00 ~ ${dates[1]
    .toISOString()
    .slice(0, 10)} ${dates[1].toTimeString().slice(0, 2)}:00`;
};
const minuteFormat = (dates: Date[]) => {
  return `${dates[0].toISOString().slice(0, 10)} ${dates[0].toTimeString().slice(0, 5)} ~ ${dates[1]
    .toISOString()
    .slice(0, 10)} ${dates[1].toTimeString().slice(0, 5)}`;
};
//초기 날짜 설정
onMounted(() => {
  const endDate = new Date();
  const startDate = new Date(new Date().setDate(endDate.getDate() - 7));
  const startMonth = { month: 0, year: endDate.getFullYear() };
  const endMonth = { month: 11, year: endDate.getFullYear() };
  date.value = [startDate, endDate];
  month.value = [startMonth, endMonth];
});

function checkMinMax(start: Date, end: Date) {
  // <!-------  일 단위 - 최대 150일 -------->
  if (selectedUnit.value === 'DD') {
    return end.getTime() - start.getTime() > 150 * 24 * 60 * 60 * 1000;
  }
  // <!-------  시간 단위 - 최대 120 시간 -------->
  else if (selectedUnit.value === 'HH') {
    return end.getTime() - start.getTime() > 120 * 60 * 60 * 1000;
  }
  // <!-------  분 단위 - 최대 480 분 -------->
  else if (selectedUnit.value === 'MI') {
    return end.getTime() - start.getTime() > 480 * 60 * 1000;
  }
}

function handleClickSearch() {
  if (props.tab === 'service') {
    emit('search', {
      svcId: selectedServices.value,
      statBaseUnit: selectedUnit.value,
      statStTm: `${date.value[0].toISOString().slice(0, 10)} ${date.value[0].toTimeString().slice(0, 5)}`,
      statEndTm: `${date.value[1].toISOString().slice(0, 10)} ${date.value[1].toTimeString().slice(0, 5)}`,
    });
  } else {
    emit('search', {
      apiId: selectedAPI.value,
      statBaseUnit: selectedUnit.value,

      statStTm: `${date.value[0].toISOString().slice(0, 10)} ${date.value[0].toTimeString().slice(0, 5)}`,
      statEndTm: `${date.value[1].toISOString().slice(0, 10)} ${date.value[1].toTimeString().slice(0, 5)}`,
    });
  }
}
</script>
<style></style>

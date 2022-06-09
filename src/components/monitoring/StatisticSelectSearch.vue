<template>
  <div class="search-wrap monitor-search key-search">
    <div class="border-cont search-cont">
      <h4 class="label-tit">기간 선택</h4>
      <div class="date-wrap">
        <div class="date-cont bg-white-date">
          <date-picker
            value-type="format"
            format="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            :disabled-date="disabledAfterTodayAndAfterEndDay"
          ></date-picker>
        </div>
        <div class="date-cont bg-white-date">
          <date-picker
            type="time"
            value-type="HH:mm"
            format="HH:mm"
            placeholder="HH:mm"
            :disabled="startDate === ''"
            :disabled-datetime="disabledAfterNowOrAfterEndTime"
          ></date-picker>
        </div>
        <span class="text">~</span>
        <div class="date-cont bg-white-date">
          <date-picker
            value-type="format"
            format="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            :disabled-date="disabledAfterTodayOrBeforeStartDay"
          ></date-picker>
        </div>
        <div class="date-cont bg-white-date">
          <date-picker
            type="time"
            value-type="HH:mm"
            format="HH:mm"
            placeholder="HH:mm"
            :disabled="endDate === ''"
            :disabled-datetime="disabledAfterNowOrBeforeStartTime"
          ></date-picker>
        </div>
      </div>
    </div>

    <!------- 서비스 ID 검색 -------->
    <div class="search-cont" v-if="tab === 'service'">
      <h4 class="label-tit">ID 검색</h4>

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
      <h4 class="label-tit">ID 검색</h4>

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
                      <label for="checkAll">전체 선택</label>
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
import { ref, reactive, computed, watch, onMounted, type Ref } from 'vue';
import DatePicker from 'vue3-datepicker';
const props = defineProps<{
  isFocus: boolean;
  propServiceList: string[] | null;
  tab: string;
  propApiList:
    | {
        sysId: string;
        apis: string[];
      }[]
    | null;
}>();

const emit = defineEmits<{
  (e: 'search', value: any): void;
}>();

let searchText = ref('');
const serviceList = computed(() => {
  return props.propServiceList
    ? props.propServiceList.filter((item: string) => item.toUpperCase().includes(searchText.value.toUpperCase()))
    : [];
}); // 서비스탭용
let selectedServices: Ref<string[]> = ref([]);
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

// API탭용
const apiList = computed(() => {
  const res: { sysId: string; apis: string[] }[] = [];
  if (!props.propApiList) {
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
const selectedAPI: Ref<string[]> = ref([]);

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
const startDate = ref('');
const startTime = ref('');
const endDate = ref('');
const endTime = ref('');
function setInitialTime() {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24);
  startDate.value =
    yesterday.getFullYear() +
    '-' +
    (yesterday.getMonth() < 9 ? '0' + (yesterday.getMonth() + 1) : yesterday.getMonth() + 1) +
    '-' +
    yesterday.getDate();
  startTime.value = yesterday.toTimeString().slice(0, 5);
  endDate.value =
    now.getFullYear() +
    '-' +
    (now.getMonth() < 9 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1) +
    '-' +
    now.getDate();
  endTime.value = now.toTimeString().slice(0, 5);
}
onMounted(() => {
  setInitialTime();
});
function disabledAfterTodayAndAfterEndDay(date: Date) {
  const today = new Date();
  const endDay = new Date(endDate.value + ' ' + (endTime.value ? endTime.value : '23:59:59'));
  return date > today || date > endDay;
}
function disabledAfterNowOrAfterEndTime(date: Date) {
  const now = new Date();
  const tmpEndTime = endTime.value ? new Date(endDate.value + 'T' + endTime.value) : new Date();
  const compDate = new Date(startDate.value + 'T' + date.toTimeString().slice(0, 8));
  return compDate > now || compDate > tmpEndTime;
}

function disabledAfterTodayOrBeforeStartDay(date: Date) {
  const today = new Date();
  const startDay = startDate.value ? new Date(startDate.value + 'T' + '00:00:00') : new Date(0);
  return date > today || date < startDay;
}

function disabledAfterNowOrBeforeStartTime(date: Date) {
  const now = new Date();
  const tmpStartTime = startTime.value ? new Date(startDate.value + 'T' + startTime.value) : new Date(0);
  const compDate = new Date(endDate.value + 'T' + date.toTimeString().slice(0, 8));
  return compDate >= now || compDate <= tmpStartTime;
}

function handleClickSearch() {
  if (startDate.value === '' || endDate.value === '') {
    alert('시작일과 종료일을 선택해주세요.');
    return;
  }
  if (props.tab === 'service') {
    emit('search', {
      svcId: selectedServices.value,
      statStTm: startDate.value + ' ' + (startTime.value ? startTime.value : '00:00'),
      statEndTm: endDate.value + ' ' + (endTime.value ? endTime.value : '00:00'),
    });
  } else {
    emit('search', {
      apiId: selectedAPI.value,
      statStTm: startDate.value + ' ' + (startTime.value ? startTime.value : '00:00'),
      statEndTm: endDate.value + ' ' + (endTime.value ? endTime.value : '00:00'),
    });
  }
}
</script>
<style></style>

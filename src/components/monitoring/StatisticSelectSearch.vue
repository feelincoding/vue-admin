<template>
  <div class="search-wrap monitor-search key-search">
    <div class="border-cont search-cont">
      <h4 class="label-tit">기간 선택</h4>
      <div class="date-wrap">
        <div class="date-cont">
          <!--  bg-white-date -->
          <Datepicker range multiCalendars locale="ko-KR" v-model="date" :format="dateFormat" :maxDate="new Date()" />
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
            class="input-box lg"
            placeholder="서비스 ID 검색"
            v-model="searchText"
          /><!-- search-focus-input -->
          <button class="mid-btn" @click="handleClickSearch">
            <i><img src="@/assets/search_ico.svg" alt="검색" /></i>Search
          </button>
        </div>

        <!--  multi select -->
        <div id="search-focus-div" v-show="isFocus" class="multi-wrap">
          <!-- search-focus-div -->
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
import { modalInjectionKey } from '@/plugins/modal/ModalPlugin';
import type { ApiSearch } from '@/types/MonitoringStatisticType';
import { format } from 'date-fns';
import { ref, reactive, computed, watch, onMounted, type Ref, inject } from 'vue';
const modal = inject(modalInjectionKey)!!;
const emit = defineEmits<{
  (e: 'search', value: any): void;
}>();
const props = defineProps<{
  isFocus: boolean;
  propServiceList: string[] | null;
  tab: string;
  propApiList: ApiSearch[] | null;
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

// 시작,종료 날짜값 선언
const date: Ref<Date[]> = ref([]);
// 화면에 표시될 날짜 포멧 설정
const dateFormat = (dates: Date[]) => {
  if (date.value[1] === null) {
    date.value[1] = date.value[0];
  }

  return format(date.value[0], 'yyyy-MM-dd HH:mm') + ' ~ ' + format(date.value[1], 'yyyy-MM-dd HH:mm');
};
//초기 날짜 설정
onMounted(() => {
  const endDate = new Date();
  const startDate = new Date(new Date().setDate(endDate.getDate() - 7));
  date.value = [startDate, endDate];
});
// 날짜 선택시 이벤트
function handleClickSearch() {
  console.log(date.value[0].toISOString().slice(0, 19));
  if (!date.value) {
    modal().show('시작 시간과 종료 시간을 선택해주세요.');
    return;
  }
  if (props.tab === 'service') {
    emit('search', {
      svcId: selectedServices.value,
      statStTm: format(date.value[0], 'yyyy-MM-dd HH:mm'),
      statEndTm: format(date.value[1], 'yyyy-MM-dd HH:mm'),
    });
  } else {
    emit('search', {
      apiId: selectedAPI.value,
      statStTm: format(date.value[0], 'yyyy-MM-dd HH:mm'),
      statEndTm: format(date.value[1], 'yyyy-MM-dd HH:mm'),
    });
  }
}
</script>

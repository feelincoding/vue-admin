<template>
  <ListLayout :title="$t('system.list_top_title')">
    <template v-slot:search-form>
      <div class="search-wrap">
        <InputBox
          v-model="(searchData['id'] as string)"
          :label="$t('system.id')"
          :placeholder="$t('common.placeholder')"
          @submit="searchOnClieckEvent"
          @input="
            (val) => {
              searchData['id'] = val;
            }
          "
        ></InputBox>
        <InputBox
          v-model="(searchData['tkcgrNm'] as string)"
          :label="$t('system.tkcgrNm')"
          :placeholder="$t('common.placeholder')"
          @submit="searchOnClieckEvent"
          @input="
            (val) => {
              searchData['tkcgrNm'] = val;
            }
          "
        />
        <button class="mid-btn" @click="searchOnClieckEvent">
          <i><img src="@/assets/search_ico.svg" :alt="$t('common.search')" /></i>{{ $t('common.search') }}
        </button>
      </div>
    </template>
    <template v-slot:list-form>
      <ListForm :title="$t('system.list_cont_title')" :total="systemPagination.totalElements">
        <template v-slot:list-btn-area>
          <button class="green-btn mid-btn" @click="registerOnClickEvent">
            <i><img src="@/assets/check_ico.svg" :alt="$t('common.register')" /></i>{{ $t('common.register') }}
          </button>
        </template>
        <template v-slot:list-table>
          <div class="tb-wrap">
            <div class="text-center" v-if="isShowProgress">
              <b-spinner label="Large Spinner"></b-spinner>
            </div>
            <table class="list-tb" v-if="!isShowProgress">
              <colgroup>
                <col width="10%" />
                <col width="*" />
                <col width="12%" />
                <col width="27%" />
                <col width="15%" />
              </colgroup>
              <thead>
                <tr>
                  <th>{{ $t('system.no') }}</th>
                  <th>{{ $t('system.id') }}</th>
                  <th>{{ $t('system.tkcgrNm') }}</th>
                  <th>{{ $t('system.update') }}</th>
                  <th>{{ $t('system.action') }}</th>
                </tr>
              </thead>

              <tbody v-if="listOption.length > 0">
                <tr v-for="(list, index) in listOption" :key="index">
                  <td @click="getRoutePage('system-detail', list.id)" v-text="getIdx(index)"></td>
                  <td class="tl" @click="getRoutePage('system-detail', list.id)">{{ list.id }}</td>
                  <td @click="getRoutePage('system-detail', list.id)">{{ list.tkcgrNm }}</td>
                  <td @click="getRoutePage('system-detail', list.id)">
                    <p class="date-txt">
                      <span>
                        {{ list.updDt === '' ? getDate(list.cretDt) : getDate(list.updDt) }}
                      </span>
                      <span>
                        {{ list.updDt === '' ? getHours(list.cretDt) : getHours(list.updDt) }}
                      </span>
                    </p>
                  </td>
                  <td>
                    <button class="mod-btn" @click="getRoutePage('system-edit', list.id)">
                      <i>{{ $t('common.modify') }}</i>
                    </button>
                    <button class="del-btn" @click="showModal(list.id)">
                      <i>{{ $t('common.delete') }}</i>
                    </button>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td class="no-data" colspan="5">{{ $t('common.no_data') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <!-- <template v-slot:pagination v-if="!isShowProgress && systemPagination"> -->
        <template v-slot:pagination v-if="!isShowProgress">
          <Paging :pagingOption="systemPagination" :isListEmpty="isListEmpty" @onChangedPage:page="onChangedPage" />
        </template>
      </ListForm>
      <ModalLayout size="s" v-if="isShowModal">
        <template v-slot:modalHeader
          ><h1 class="h1-tit">{{ $t('system.modal_system_delete') }}</h1>
        </template>
        <template v-slot:modalContainer>
          <p class="text">{{ currId }} &nbsp; {{ $t('system.modal_delete_message') }}</p>
        </template>
        <template v-slot:modalFooter>
          <button class="purple-btn lg-btn" @click="deleteSystem" :disabled="isDisabled">
            {{ $t('common.ok') }}<b-spinner variant="light" v-if="isDisabled" small></b-spinner>
          </button>
          <button class="lg-btn white-btn" @click="closeModal" :disabled="isDisabled">
            {{ $t('common.cancel') }}
          </button>
        </template>
      </ModalLayout>
    </template>
  </ListLayout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, inject } from 'vue';
import type { Ref } from 'vue';

import ListLayout from '@/components/layout/ListLayout.vue';
import SystemModule from '@/repository/SystemRepository';

import InputBox from '@/components/commons/search-option/InputBox.vue';
import ListForm from '@/components/commons/ListForm.vue';
import Paging from '@/components/commons/Paging.vue';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';

import type { SearchCondition } from '@/types/SearchType';
import type { SystemResponse } from '@/types/SystemType';
import type { Pagination } from '@/types/GateWayResponse';

import { convertDate, convertTime } from '@/utils/converter';
import type { GateWayError } from '@/error/GateWayError';
import ErrorCode from '@/error/ErrorCodes';

import { useRoute, useRouter } from 'vue-router';
import { BSpinner } from 'bootstrap-vue-3';
import { useI18n } from 'vue-i18n';
import { modalInjectionKey, type ModalFunction } from '@/plugins/modal/ModalPlugin';
import { useToast } from 'vue-toastification';

const router = useRouter();
const modal = inject(modalInjectionKey) as ModalFunction;
const { t } = useI18n();
const toast = useToast();

const systemModule = new SystemModule();

const listOption: Ref<SystemResponse[]> = ref([]);
const searchData: Ref<SearchCondition> = ref({});
const systemPagination: Ref<Pagination> = ref({
  page: 0,
  size: 0,
  totalElements: 0,
  totalPage: 0,
  currentElements: 0,
  currentPage: 0,
  orderBy: '',
  sortBy: '',
  limit: 0,
});

const currId = ref('');
const isShowProgress = ref(true);
const isShowModal = ref(false);
const isDisabled = ref(false);
const isListEmpty = ref(false);

const route = useRoute();

watch(listOption, () => {
  if (listOption.value.length === 0) {
    isListEmpty.value = true;
  } else {
    isListEmpty.value = false;
  }
});

onMounted(() => {
  let param = {} as SearchCondition;
  if (Object.keys(route.query).filter((key) => key === 'id' && route.query[key] !== '').length > 0) {
    param.id = route.query.id as string;
    searchData.value.id = param.id;
  }
  if (Object.keys(route.query).filter((key) => key === 'tkcgrNm' && route.query[key] !== '').length > 0) {
    param.tkcgrNm = route.query.tkcgrNm as string;
    searchData.value.tkcgrNm = param.tkcgrNm;
  }

  if (Object.keys(route.query).includes('page')) param.page = route.query.page as string;

  _getSystemList(param);
});

// CRUD 관련
const _getSystemList = (param: SearchCondition) => {
  isShowProgress.value = true;
  systemModule
    .getSystemList(param)
    .then((res) => {
      isShowProgress.value = false;

      listOption.value = res.value;
      systemPagination.value = res.pagination as Pagination;
    })
    .catch((error: GateWayError) => {
      if (error.getErrorCode() == ErrorCode.CANCEL_ERROR) {
        console.log('SYSTEM API Cancel');
      } else {
        isShowProgress.value = false;
        modal().show(t('error.server_error'));
      }
    });
};

const getList = (option: string) => {
  let param = {} as SearchCondition;

  if (option === 'page') {
    // 1. 페이지 이동
    param.page = searchData.value.page;

    if (Object.keys(route.query).filter((key) => key === 'id' && route.query[key] !== '').length > 0) {
      param.id = route.query.id as string;
    }
    if (Object.keys(route.query).filter((key) => key === 'tkcgrNm' && route.query[key] !== '').length > 0) {
      param.tkcgrNm = route.query.tkcgrNm as string;
    }
  } else if (option === 'search') {
    // 2. 검색 조건 변경
    if (searchData.value.id !== undefined) param.id = searchData.value.id;
    if (searchData.value.tkcgrNm !== undefined) param.tkcgrNm = searchData.value.tkcgrNm;
  }
  if (Object.is(JSON.stringify(router.currentRoute.value.query), JSON.stringify(param))) {
    _getSystemList(param);
  } else {
    router.push({
      name: 'system',
      query: { ...param },
    });
  }
};

const deleteSystem = async () => {
  isDisabled.value = true;

  await systemModule
    .deleteSystem(currId.value)
    .then(() => {
      closeModal();
      isDisabled.value = false;
      searchData.value = {};

      _getSystemList(searchData.value);
      toast.success(t('common.delete_success'), {
        toastClassName: ['toast-success-custom-class'],
      });
    })
    .catch((error: GateWayError | any) => {
      if (error.getErrorCode() == ErrorCode.SYSTEM_DELETE_FAILED) {
        toast.error(t('system.system_delete_fail', { system_name: currId }));
      }
      isDisabled.value = false;
    });
};

// click event 함수
const searchOnClieckEvent = () => {
  delete searchData.value.page;
  Object.keys(searchData.value).forEach((key) => {
    const value = searchData.value[key as keyof SearchCondition];
    if (value === '') delete searchData.value[key as keyof SearchCondition];
  });

  getList('search');
};

const onChangedPage = (page: number) => {
  searchData.value.page = String(page);
  getList('page');
};

const registerOnClickEvent = () => {
  router.push({ name: 'system-register' });
};

// get 함수
const getRoutePage = (page: string, id?: string): void => {
  if (id) {
    router.push({ name: page, params: { id: id } });
  } else {
    router.push({ name: page });
  }
};

const getIdx = (index: number): number => {
  return systemPagination.value.totalElements - systemPagination.value.currentPage * 10 - index;
};

const getDate = (date: string) => {
  return convertDate(date);
};

const getHours = (date: string) => {
  return convertTime(date);
};

// 모달 on/off
const showModal = (id: string) => {
  currId.value = id;
  isShowModal.value = true;
};

const closeModal = () => {
  isShowModal.value = false;
};
</script>

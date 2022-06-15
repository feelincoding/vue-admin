<template>
  <ListLayout :title="$t('service.title')">
    <template v-slot:search-form>
      <div class="search-wrap">
        <!-- Input Box 옵션 -->
        <div class="search-cont">
          <InputBox
            v-model="(searchData['id'] as string)"
            :label="$t('service.id')"
            :placeholder="$t('common.placeholder')"
            @submit="searchOnClieckEvent"
            @input="
              (val) => {
                searchData['id'] = val;
              }
            "
          ></InputBox>
        </div>
        <div class="search-cont">
          <InputBox
            v-model="(searchData['athnType'] as string)"
            :label="$t('service.authentication_method')"
            :placeholder="$t('common.placeholder')"
            @submit="searchOnClieckEvent"
            @input="
              (val) => {
                searchData['athnType'] = val;
              }
            "
          />
        </div>
        <button class="mid-btn" @click="searchOnClieckEvent">
          <i><img src="@/assets/search_ico.svg" :alt="$t('common.search')" /></i>{{ $t('common.search') }}
        </button>
      </div>
    </template>
    <template v-slot:list-form>
      <ListForm
        :title="$t('service.list_title')"
        :isShowProgress="isShowProgress"
        :total="servicePagination.totalElements"
      >
        <template v-slot:list-btn-area>
          <button class="green-btn mid-btn" @click="$router.push({ name: 'service-register' })">
            <i><img src="@/assets/check_ico.svg" :alt="$t('common.register')" /></i>{{ $t('common.register') }}
          </button>
        </template>

        <template v-slot:list-table>
          <div class="text-center" v-if="isShowProgress">
            <b-spinner label="Large Spinner"></b-spinner>
          </div>
          <table class="list-tb" v-if="!isShowProgress">
            <colgroup>
              <col width="7%" />
              <col width="20%" />
              <col width="13%" />
              <col width="*" />
              <col width="17%" />
              <col width="10%" />
            </colgroup>
            <thead>
              <tr>
                <th>{{ $t('service.no') }}</th>
                <th>{{ $t('service.id') }}</th>
                <th>{{ $t('service.authentication_method') }}</th>
                <th>{{ $t('service.validity') }}</th>
                <th>{{ $t('service.update') }}</th>
                <th>{{ $t('service.action') }}</th>
              </tr>
            </thead>
            <div class="text-center">
              <b-spinner
                v-show="isShowProgress"
                style="width: 2rem; height: 2rem; position: absolute; left: 50%; margin-top: 2.5%"
                label="Large Spinner"
              ></b-spinner>
            </div>
            <tbody v-if="serviceList.length > 0">
              <tr v-for="(list, index) in serviceList" :key="index">
                <td v-text="getIdx(index)"></td>
                <td class="tl" @click="$router.push({ name: 'service-detail', params: { id: list.id } })">
                  {{ list.id }}
                </td>
                <td @click="$router.push({ name: 'service-detail', params: { id: list.id } })">
                  {{ list.athnType }}
                </td>
                <td @click="$router.push({ name: 'service-detail', params: { id: list.id } })">
                  <span>{{ list.svcStDt.slice(0, 10) }}</span> ~ <span>{{ list.svcEndDt.slice(0, 10) }}</span>
                </td>
                <td @click="$router.push({ name: 'service-detail', params: { id: list.id } })">
                  <p class="date-txt">
                    <span> {{ getDate(list.updDt) }}</span
                    ><span>{{ getHours(list.updDt) }}</span>
                  </p>
                </td>
                <td>
                  <button class="mod-btn" @click="$router.push({ name: 'service-edit', params: { id: list.id } })">
                    <i>{{ $t('common.modify') }}</i>
                  </button>
                  <button class="del-btn" @click="modalShow(list.id)">
                    <i>{{ $t('common.delete') }}</i>
                  </button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td class="no-data" colspan="6">{{ $t('common.no_data') }}</td>
              </tr>
            </tbody>
          </table>
        </template>
        <template v-slot:pagination v-if="!isShowProgress">
          <Paging :pagingOption="servicePagination" :isListEmpty="isListEmpty" @onChangedPage:page="onChangedPage" />
        </template>
      </ListForm>
      <ModalLayout size="s" v-if="deleteModal">
        <template v-slot:modalHeader
          ><h1 class="h1-tit">{{ $t('service.delete') }}</h1>
        </template>
        <template v-slot:modalContainer>
          <p class="text">{{ $t('service.delete_message') }}</p>
        </template>
        <template v-slot:modalFooter
          ><button class="lg-btn purple-btn" @click="deleteService(deleteId)" :disabled="isRegisterProgress">
            {{ $t('common.ok') }}
            <b-spinner variant="light" v-show="isRegisterProgress" small></b-spinner></button
          ><button class="lg-btn white-btn" @click="modalHide()" :disabled="isRegisterProgress">
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
import InputBox from '@/components/commons/search-option/InputBox.vue';
import ListForm from '@/components/commons/ListForm.vue';
import type { ServiceResponse } from '@/types/ServiceType';
import type { SearchCondition } from '@/types/SearchType';
import type { Pagination } from '@/types/GateWayResponse';
import Paging from '@/components/commons/Paging.vue';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
import { convertDate, convertTime } from '@/utils/converter';
import ServiceRepository from '@/repository/service-repository';

import { useRoute, useRouter } from 'vue-router';
// import bootstrap from 'bootstrap-vue-3';
import { BSpinner } from 'bootstrap-vue-3';
import type { GateWayError } from '@/error/GateWayError';
import ErrorCode from '@/error/ErrorCodes';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { modalInjectionKey, type ModalFunction } from '@/plugins/modal/ModalPlugin';

const modal = inject(modalInjectionKey) as ModalFunction;
const { t } = useI18n();
const toast = useToast();
const serviceRepository = new ServiceRepository();
const searchData: Ref<SearchCondition> = ref({});
const isShowProgress = ref(true);
const isRegisterProgress = ref(false);
const isListEmpty = ref(false);
const serviceList: Ref<ServiceResponse[]> = ref([]);
const servicePagination: Ref<Pagination> = ref({
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
const deleteModal = ref(false);
const deleteId = ref('');
const route = useRoute();
const router = useRouter();

const getDate = (date: string) => {
  return convertDate(date);
};
const getHours = (date: string) => {
  return convertTime(date);
};

watch(serviceList, () => {
  if (serviceList.value.length === 0) {
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
  if (Object.keys(route.query).filter((key) => key === 'athnType' && route.query[key] !== '').length > 0) {
    param.athnType = route.query.athnType as string;
    searchData.value.athnType = param.athnType;
  }
  if (Object.keys(route.query).includes('page')) param.page = route.query.page as string;
  _getServiceList(param);
});

const _getServiceList = (param: SearchCondition) => {
  isShowProgress.value = true;
  serviceList.value = [];
  serviceRepository
    .getServiceList(param)
    .then((res) => {
      isShowProgress.value = false;
      serviceList.value = res.value;
      servicePagination.value = res.pagination as Pagination;
    })
    .catch((error: GateWayError) => {
      if (error.getErrorCode() == ErrorCode.CANCEL_ERROR) {
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
    if (Object.keys(route.query).filter((key) => key === 'athnType' && route.query[key] !== '').length > 0) {
      param.athnType = route.query.athnType as string;
    }
  } else if (option === 'search') {
    // 2. 검색 조건 변경
    if (searchData.value.id !== undefined) param.id = searchData.value.id;
    if (searchData.value.athnType !== undefined) param.athnType = searchData.value.athnType;
  }
  if (Object.is(JSON.stringify(router.currentRoute.value.query), JSON.stringify(param))) {
    _getServiceList(param);
  } else {
    router.push({
      name: 'service',
      query: { ...param },
    });
  }
};

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

const getIdx = (index: number): number => {
  return servicePagination.value.totalElements - servicePagination.value.currentPage * 10 - index;
};

const modalShow = (id: string) => {
  deleteId.value = id;
  deleteModal.value = true;
};
const modalHide = () => {
  deleteModal.value = false;
};

const deleteService = (serviceId: string) => {
  isRegisterProgress.value = true;
  serviceRepository
    .deleteService(serviceId)
    .then(() => {
      _getServiceList(searchData.value);
      deleteModal.value = false;
      isRegisterProgress.value = false;
      toast.success(t('common.delete_success'), {
        toastClassName: ['toast-success-custom-class'],
      });
    })
    .catch((error: GateWayError | any) => {
      if (error.getErrorCode() == ErrorCode.SYSTEM_DELETE_FAILED) {
        toast.error(t('service.service_delete_fail', { serviceId: serviceId }));
      }
      isRegisterProgress.value = false;
    });
};
</script>

<style scoped></style>

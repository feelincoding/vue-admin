<template>
  <ListLayout :title="$t('service.title')">
    <template v-slot:search-form>
      <div class="search-wrap">
        <!-- <h2 class="h2-tit">{{ $t('common.search') }}</h2> -->

        <!-- Input Box 옵션 -->
        <div class="search-cont">
          <InputBox
            v-model="(searchData['id'] as string)"
            :label="$t('service.id')"
            :placeholder="$t('common.placeholder')"
            @submit="searchOnClieckEvent"
          />
        </div>
        <div class="search-cont">
          <InputBox
            v-model="(searchData['athnType'] as string)"
            :label="$t('service.authentication_method')"
            :placeholder="$t('common.placeholder')"
            @submit="searchOnClieckEvent"
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
          <button class="mid-btn" @click="$router.push({ name: 'service-register' })">
            <i><img src="@/assets/check_ico.svg" alt="등록" /></i>{{ $t('common.register') }}
          </button>
        </template>

        <template v-slot:list-table>
          <div class="tb-wrap">
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
                      <span> {{ list.updDt === '' ? getDate(list.cretDt) : getDate(list.updDt) }}</span
                      ><span>{{ list.updDt === '' ? getHours(list.cretDt) : getHours(list.updDt) }}</span>
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
          </div>
        </template>
        <template v-slot:pagination v-if="!isShowProgress">
          <Paging :pagingOption="servicePagination" :isListEmpty="isListEmpty" @onChangedPage:page="onChangedPage" />
          <ModalLayout size="s" v-if="modal">
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
      </ListForm>
    </template>
  </ListLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
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

import { useRoute } from 'vue-router';
import router from '@/router';
import bootstrap from 'bootstrap-vue-3';
import { BSpinner } from 'bootstrap-vue-3';

const serviceRepository = new ServiceRepository();
const searchData: Ref<SearchCondition> = ref({});
const isShowProgress = ref(true);
const isRegisterProgress = ref(false);
const isListEmpty = ref(false);
const serviceList: Ref<ServiceResponse[]> = ref([]);
const servicePagination: Ref<Pagination> = ref({} as Pagination);
const modal = ref(false);
const deleteId = ref('');
const route = useRoute();

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
  _getServiceList();
});

const _getServiceList = () => {
  isShowProgress.value = true;
  serviceList.value = [];
  servicePagination.value = {} as Pagination;

  if (Object.keys(route.query).length > 0) {
    if (Object.keys(route.query).includes('id')) searchData.value.id = route.query.id as string;
    if (Object.keys(route.query).includes('athnType')) searchData.value.athnType = route.query.athnType as string;
    if (Object.keys(route.query).includes('page')) searchData.value.page = route.query.page as string;
    serviceRepository
      .getServiceList(searchData.value)
      .then((result) => {
        serviceList.value = result.value;
        servicePagination.value = result.pagination!;
        isShowProgress.value = false;
      })
      .catch((error) => {
        isShowProgress.value = false;
        // this.$modal.show(`${this.$t('error.server_error')}`);
      });
  } else {
    serviceRepository
      .getServiceList()
      .then((result) => {
        serviceList.value = result.value;
        servicePagination.value = result.pagination!;
        isShowProgress.value = false;
      })
      .catch((error) => {
        isShowProgress.value = false;
        // this.$modal.show(`${this.$t('error.server_error')}`);
      });
  }
};

const getList = () => {
  const query = {} as SearchCondition;
  if (Object.keys(searchData.value).includes('id')) query.id = searchData.value.id as string;
  if (Object.keys(searchData.value).includes('athnType')) query.athnType = searchData.value.athnType as string;
  if (Object.keys(searchData.value).includes('page')) query.page = searchData.value.page;
  if (Object.keys(searchData.value).includes('size')) query.size = searchData.value.size;
  if (Object.keys(searchData.value).includes('sort_by')) query.sort_by = searchData.value.sort_by as string;
  if (Object.keys(searchData.value).includes('ordeer_by')) query.order_by = searchData.value.order_by as string;

  if (Object.is(JSON.stringify(router.currentRoute.value.query), JSON.stringify(query))) {
    _getServiceList();
  } else {
    router.push({
      name: 'service',
      query: {
        ...query,
      },
    });
  }
};

const searchOnClieckEvent = () => {
  getList();
};

const onChangedPage = (page: number) => {
  searchData.value.page = String(page);
  getList();
};

const getIdx = (index: number): number => {
  return servicePagination.value.totalElements - servicePagination.value.currentPage * 10 - index;
};

const modalShow = (id: string) => {
  deleteId.value = id;
  modal.value = true;
};
const modalHide = () => {
  modal.value = false;
};

const deleteService = (serviceId: string) => {
  isRegisterProgress.value = true;
  serviceRepository
    .deleteService(serviceId)
    .then(() => {
      _getServiceList();
      modal.value = false;
      isRegisterProgress.value = false;
      // $toast.success($t('common.delete_success'), {
      //   toastClassName: ['toast-success-custom-class'],
      // });
    })
    .catch(() => {
      isRegisterProgress.value = false;
      // this.$modal.show(`${this.$t('error.server_error')}`);
    });
};
</script>

<style scoped></style>

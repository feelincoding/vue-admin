<template>
  <ListLayout :title="$t('system.list_top_title')">
    <template v-slot:search-form>
      <div class="search-wrap">
        <!-- Input Box 옵션 -->
        <div class="search-cont">
          <InputBox
            v-model="searchData['id']"
            :label="$t('system.id')"
            :placeholder="$t('common.placeholder')"
            @submit="searchOnClieckEvent"
          ></InputBox>
        </div>
        <div class="search-cont">
          <InputBox
            v-model="searchData['tkcgrNm']"
            :label="$t('system.tkcgrNm')"
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
      <ListForm :title="$t('system.list_cont_title')" :total="systemPagination.totalElements">
        <template v-slot:list-btn-area>
          <button class="mid-btn" @click="registerOnClickEvent">
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
        <template v-slot:pagination v-if="!isShowProgress">
          <Paging :pagingOption="systemPagination" :isListEmpty="isListEmpty" @onChangedPage:page="onChangedPage" />
        </template>
      </ListForm>
    </template>
  </ListLayout>
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

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import type { Ref } from 'vue';

import ListLayout from '@/components/layout/ListLayout.vue';
import SystemModule from '@/stores/modules/SystemModule';

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

import { useRoute } from 'vue-router';
import router from '@/router';
import bootstrap from 'bootstrap-vue-3';

const systemModule = new SystemModule();

const listOption: Ref<SystemResponse[]> = ref([]);
const systemPagination: Ref<Pagination> = ref({}) as Ref<Pagination>;

const searchData: Ref<SearchCondition> = ref({});
const DateList: Ref<string[][]> = ref([]);

const isShowProgress = ref(true);
const isShowModal = ref(false);
const isDisabled = ref(false);
const isListEmpty = ref(false);

const currId = ref('');

const route = useRoute();

watch(listOption, () => {
  if (listOption.value.length === 0) {
    isListEmpty.value = true;
  } else {
    isListEmpty.value = false;
  }
});
onMounted(() => {
  _getSystemList();
});

const _getSystemList = () => {
  isShowProgress.value = true;

  if (Object.keys(route.query).length > 0) {
    if (Object.keys(route.query).includes('id')) searchData.value.id = route.query.id as string;
    if (Object.keys(route.query).includes('tkcgrNm')) searchData.value.tkcgrNm = route.query.tkcgrNm as string;
    if (Object.keys(route.query).includes('page')) searchData.value.page = route.query.page as string;

    systemModule
      .getSystemList(searchData.value)
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
          // $modal.show(`${$t('error.server_error')}`);
        }
      });
  } else {
    systemModule
      .getSystemList()
      .then((res) => {
        isShowProgress.value = false;

        listOption.value = res.value;
        systemPagination.value = res.pagination as Pagination;
      })
      .catch((error) => {
        if (error.getErrorCode() == ErrorCode.CANCEL_ERROR) {
          console.log('SYSTEM API Cancel');
        } else {
          isShowProgress.value = false;
          // $modal.show(`${$t('error.server_error')}`);
        }
      });
  }
};

const searchOnClieckEvent = () => {
  getList();
};
const getList = () => {
  if (Object.is(JSON.stringify(router.currentRoute.value.query), JSON.stringify(searchData.value))) {
    _getSystemList();
  } else {
    router.push({
      name: 'system',
      query: {
        ...searchData.value,
      },
    });
  }
};
const onChangedPage = (page: number) => {
  searchData.value.page = String(page);
  getList();
};

const registerOnClickEvent = () => {
  router.push({ name: 'system-register' });
};

const getRoutePage = (page: string, id?: string): void => {
  if (id) {
    router.push({ name: page, params: { id: id } });
  } else {
    router.push({ name: page });
  }
};
const deleteSystem = async () => {
  isDisabled.value = true;

  await systemModule
    .deleteSystem(currId.value)
    .then(() => {
      closeModal();
      isDisabled.value = false;
      _getSystemList();
      // $toast.success($t('common.delete_success'), {
      //   toastClassName: ['toast-success-custom-class'],
      // });
    })
    .catch((error: GateWayError | any) => {
      if (error.getErrorCode() == ErrorCode.SYSTEM_DELETE_FAILED) {
        // $toast.error($t('system.system_delete_fail', { system_name: currId }));
      }
      isDisabled.value = false;
    });
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

const showModal = (id: string) => {
  currId.value = id;
  isShowModal.value = true;
};

const closeModal = () => {
  isShowModal.value = false;
};
</script>

<style scoped></style>

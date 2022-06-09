<template>
  <div>
    <ListLayout :title="$t('api.apiManagement')" subTitle="API List">
      <template v-slot:search-form>
        <div class="search-wrap">
          <!-- <h2 class="h2-tit">{{ $t('common.search') }}</h2> -->
          <div class="search-cont">
            <SelectBox
              :searchTarget.sync="searchTarget"
              :searchValue.sync="searchValue"
              :label="searchOption.label"
              :selectOptions="searchOption.selectOptions"
              @submit="searchOnClieckEvent"
            />
          </div>

          <button class="mid-btn" @click="searchOnClieckEvent">
            <i><img src="@/assets/search_ico.svg" :alt="$t('common.search')" /></i>{{ $t('common.search') }}
          </button>
        </div>
      </template>
      <template v-slot:list-form>
        <ListForm title="API List" :total="pagination.totalElements">
          <template v-slot:list-btn-area>
            <button class="mid-btn" @click="$router.push({ name: 'api-register' })">
              <i><img src="@/assets/check_ico.svg" :alt="$t('common.register')" /></i>{{ $t('common.register') }}
            </button>
          </template>
          <template v-slot:list-table>
            <div class="tb-wrap">
              <div class="text-center" v-if="isShowProgress">
                <b-spinner label="Large Spinner"></b-spinner>
              </div>
              <table class="list-tb" v-if="!isShowProgress">
                <caption>
                  API ID, Method, URI, Time out, Update, 수정, 삭제 항목 테이블
                </caption>
                <colgroup>
                  <col width="6%" />
                  <col width="13%" />
                  <col width="13%" />
                  <col width="16%" />
                  <col width="*" />
                  <col width="9%" />
                  <col width="13%" />
                  <col width="10%" />
                </colgroup>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>{{ $t('api.sysId') }}</th>
                    <th>{{ $t('api.apiId') }}</th>
                    <th>{{ $t('api.method') }}</th>
                    <th>{{ $t('api.uri') }}</th>
                    <th>{{ $t('api.timeOut') }}<br />(ms)</th>
                    <th>{{ $t('api.update') }}</th>
                    <th>{{ $t('api.action') }}</th>
                  </tr>
                </thead>
                <div class="text-center">
                  <b-spinner
                    v-show="isShowProgress"
                    style="width: 2rem; height: 2rem; position: absolute; left: 50%"
                    label="Large Spinner"
                  ></b-spinner>
                </div>
                <tbody v-if="apiList.length > 0">
                  <ListRow
                    v-for="(apiData, index) in apiList"
                    :key="index"
                    :apiData="apiData"
                    :index="index"
                    :pagination="pagination"
                    @deleteApi="handleOndeleteApi"
                  />
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="8">{{ $t('common.no_data') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <template v-slot:pagination v-if="!isShowProgress">
            <Paging
              v-if="pagination"
              :pagingOption="pagination"
              :isListEmpty="isListEmpty"
              @onChangedPage:page="onChangedPage"
            />
            <ModalLayout size="s" v-if="showModal">
              <template v-slot:modalHeader><h1 class="h1-tit">API 삭제</h1> </template>
              <template v-slot:modalContainer>
                <p class="text">{{ deleteMsg.id }}를 삭제하시겠습니까?</p>
              </template>
              <template v-slot:modalFooter
                ><button class="lg-btn purple-btn" @click="deleteApi" :disabled="isModalProgress">
                  {{ $t('common.ok')
                  }}<b-spinner variant="light" label="Spinning" v-if="isModalProgress" small></b-spinner>
                </button>
                <button class="lg-btn white-btn" @click="showModal = false" :disabled="isModalProgress">
                  {{ $t('common.cancel') }}
                </button>
              </template>
            </ModalLayout>
          </template>
        </ListForm>
      </template>
    </ListLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, type Ref } from 'vue';
import ListLayout from '@/components/layout/ListLayout.vue';
import ListForm from '@/components/commons/ListForm.vue';
import ListRow from '@/components/api-mngt/list/ListRow.vue';
import type { ApiDetailResponse } from '@/types/ApiType';
import ApiModule from '@/repository/ApiMngtRepository';
import SelectBox from '@/components/commons/search-option/SelectBox.vue';
import InputBox from '@/components/commons/search-option/InputBox.vue';
import type { SearchCondition, SelectOptionType } from '@/types/SearchType';
import Paging from '@/components/commons/Paging.vue';
import { BSpinner } from 'bootstrap-vue-3';
import type { Pagination } from '@/types/GateWayResponse';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
import ErrorCode from '@/error/ErrorCodes';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import router from '@/router';

const route = useRoute();
const showModal = ref(false);
const isModalProgress = ref(false);
const isShowProgress = ref(false);
const isListEmpty = ref(false);
const deleteMsg = ref({ id: '', sysId: '' });
const { t } = useI18n({});
const searchTarget = ref('id');
const searchValue = ref('');
const pagingData: SearchCondition = {};
const apiList: Ref<ApiDetailResponse[]> = ref([]);
const pagination: Ref<Pagination> = ref({
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

let apiModule = new ApiModule();

const handleOndeleteApi = (msg: { id: string; sysId: string }) => {
  deleteMsg.value = msg;
  showModal.value = true;
  useI18n;
};

const searchOption: { type: string; label: string; placeholder: string; selectOptions: SelectOptionType[] } = {
  type: 'selectBox',
  label: t('api.basicInformation'),

  placeholder: t('api.placeholder'),
  selectOptions: [
    { label: 'id', value: t('api.apiId') },
    { label: 'sysId', value: t('api.sysId') },
    { label: 'uriIn', value: t('api.uri') },
  ],
};

onMounted(() => {
  fetchApiList();
});

watch(apiList, () => {
  if (apiList.value.length === 0) {
    isListEmpty.value = true;
  } else {
    isListEmpty.value = false;
  }
});

const fetchApiList = () => {
  isShowProgress.value = true;

  const query = route.query;

  if (Object.keys(query).length > 0) {
    console.log('query 추가', query);
    searchTarget.value = Object.keys(query)[0];
    searchValue.value = query[searchTarget.value] as string;
  }

  apiModule
    .getApiList(query)
    .then((res) => {
      apiList.value = res.apiList;
      if (res.pagination) pagination.value = res.pagination;
      isShowProgress.value = false;
    })
    .catch((error) => {
      if (error.getErrorCode() == ErrorCode.CANCEL_ERROR) {
        console.log('API API Cancel');
      } else {
        isShowProgress.value = false;
        // this.$modal.show(`${this.$t('error.server_error')}`);
      }
    });
};

const deleteApi = async () => {
  const query = { id: deleteMsg.value.id, sysId: deleteMsg.value.sysId };
  isModalProgress.value = true;
  await apiModule
    .deleteApi(query)
    .then(() => {
      showModal.value = false;
      isModalProgress.value = false;
      // this.$toast.success(this.$t('common.delete_success'), {
      //   toastClassName: ['toast-success-custom-class'],
      // });
    })
    .catch(() => {
      showModal.value = false;
      isModalProgress.value = false;
      // this.$modal.show(`${this.$t('error.server_error')}`);
    });

  fetchApiList();
};

// for searching
const searchOnClieckEvent = () => {
  console.log('searchOnClieckEvent' + searchValue.value);
  const query: { [key: string]: string } = {};
  query[searchTarget.value] = searchValue.value;
  if (JSON.stringify(query) === JSON.stringify(route.query)) {
    fetchApiList();
  } else {
    getList();
  }
};

// for paging
const onChangedPage = (page: number) => {
  pagingData.page = String(page);
  getList();
};

const getList = () => {
  const query = {} as { [key: string]: string };
  if (searchTarget) query[searchTarget.value] = searchValue.value;
  if (Object.keys(pagingData).includes('page')) query.page = pagingData.page as string;
  if (Object.keys(pagingData).includes('size')) query.size = pagingData.size as string;
  if (Object.keys(pagingData).includes('sort_by')) query.sort_by = pagingData.sort_by as string;
  if (Object.keys(pagingData).includes('ordeer_by')) query.order_by = pagingData.order_by as string;

  router.push({
    name: 'api',
    query: {
      ...query,
    },
  });
};
</script>

<style scoped></style>

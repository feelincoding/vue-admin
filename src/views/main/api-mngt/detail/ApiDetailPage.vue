<template>
  <ContentLayout
    :title="$t('api.api') + ' ' + t('api.information') + ' ' + $t('common.ok')"
    :subTitle="$t('api.basicInformation') + ' ' + $t('common.ok')"
    :depth="$t('api.api') + ' ' + $t('api.management')"
    :isShowProgress="isShowProgress"
    :isEmShow="false"
  >
    <template v-slot:contents v-if="!isShowProgress && apiDetail">
      <!-- 레이아웃을 제외한 실제 컨텐츠 부분을 넣어주세요 -->
      <div class="form-wrap">
        <ul>
          <InfoGroup :inputNm="$t('api.sysId') + ' :'" :value="apiDetail.sysId" />
          <InfoGroup :inputNm="$t('api.apiId') + ' :'" :value="apiDetail.id" />
          <InfoGroup :inputNm="$t('api.interface') + ' ' + $t('api.number') + ' :'" :value="apiDetail.ifNo" />
          <MethodGroup :inputNm="$t('api.method') + ' :'" :methods="apiDetail.meth" />
          <URIGroup :inputNm="$t('api.uri') + ' :'" :uriSer="apiDetail.uriIn" :uriSys="apiDetail.uriOut" />
          <EndPointGroup groupNm="End-point :" :edptList="edptList" />

          <InfoGroup
            :inputNm="$t('api.request') + ' ' + $t('api.handler') + ' ' + $t('api.group') + ' :'"
            :value="apiDetail.reqHndlrGrpId"
          />
          <InfoGroup
            :inputNm="$t('api.response') + ' ' + $t('api.handler') + ' ' + $t('api.group') + ' :'"
            :value="apiDetail.resHndlrGrpId"
          />
          <InfoGroup :inputNm="$t('api.timeOutMS') + ' :'" :value="'' + apiDetail.timeOut" />
          <InfoGroup :inputNm="$t('api.api') + ' ' + $t('api.description') + ' :'" :value="apiDetail.desc" />
          <ModalLayout size="s" v-if="showModal">
            <template v-slot:modalHeader
              ><h1 class="h1-tit">{{ $t('api.delete_modal_title') }}</h1>
            </template>
            <template v-slot:modalContainer>
              <p class="text">{{ $t('api.delete_api', { apiName: deleteMsg }) }}</p>
            </template>
            <template v-slot:modalFooter
              ><button class="lg-btn purple-btn" @click="deleteApi">{{ $t('common.ok') }}</button
              ><button class="lg-btn white-btn" @click="showModal = false">{{ $t('common.cancel') }}</button>
            </template>
          </ModalLayout>
        </ul>
      </div>
    </template>

    <template v-slot:buttons v-if="!isShowProgress">
      <!-- 레이아웃과 컨텐츠를 제외한 나머지 버튼들을 넣어주세요 -->
      <div class="btn-wrap">
        <button
          :disabled="isButtonDisabled"
          class="lg-btn purple-btn"
          @click="$router.push({ name: 'api-edit', query: { id: apiDetail.id, sysId: apiDetail.sysId } })"
        >
          {{ $t('api.edit') }}
        </button>
        <button :disabled="isButtonDisabled" class="lg-btn white-btn" @click="showModal = true">
          {{ $t('api.delete') }}<b-spinner label="Spinning" v-if="isButtonDisabled" small></b-spinner>
        </button>
        <button :disabled="isButtonDisabled" class="lg-btn gray-btn" @click="$router.go(-1)">
          {{ $t('api.list') }}
        </button>
      </div>
    </template>
  </ContentLayout>
</template>

<script setup lang="ts">
import InfoGroup from '@/components/api-mngt/detail/InfoGroup.vue';
import MethodGroup from '@/components/api-mngt/detail/MethodGroup.vue';
import URIGroup from '@/components/api-mngt/detail/URIGroup.vue';
import EndPointGroup from '@/components/api-mngt/register/EndPointGroup.vue';
import ContentLayout from '@/components/layout/ContentLayout.vue';
import type { ApiDetailResponse } from '@/types/ApiType';
import ApiModule from '@/repository/ApiRepository';
import SystemModule from '@/repository/SystemRepository';
import { type Ref, ref, onMounted, inject, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { modalInjectionKey, type ModalFunction } from '@/plugins/modal/ModalPlugin';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';

const { t } = useI18n({});
const route = useRoute();
const router = useRouter();
const toast = useToast();

let apiModule = new ApiModule();
let systemModule = new SystemModule();
const edptList: Ref<string[]> = ref([]);
const apiDetail: Ref<ApiDetailResponse> = ref({
  id: '',
  sysId: '',
  ifNo: '',
  meth: [''],
  uriIn: '',
  uriOut: '',
  ifGrp: '',
  reqHndlrGrpId: '',
  resHndlrGrpId: '',
  timeOut: 0,
  desc: '',
  cretDt: '',
  cretId: '',
  updDt: '',
  updId: '',
});

const isShowProgress = ref(false);
const deleteMsg = ref('');
const modal = inject(modalInjectionKey) as ModalFunction;
const showModal = ref(false);
const isButtonDisabled = ref(false);

onMounted(() => {
  isShowProgress.value = true;
  const query = route.query as { id: string; sysId: string };
  apiModule
    .getApiDetail(query)
    .then((res) => {
      apiDetail.value = res;
      deleteMsg.value = apiDetail.value.id;
      isShowProgress.value = false;
    })
    .catch(() => {
      isShowProgress.value = false;
      modal().show(t('error.server_error'));
    });
});

watch(apiDetail, () => {
  console.log('apiDetail changed');
  if (apiDetail) {
    systemModule
      .getSystemDetail(apiDetail.value.sysId)
      .then((res) => {
        edptList.value = res.edpt;
        isShowProgress.value = false;
      })
      .catch(() => {
        isShowProgress.value = false;
        modal().show(t('error.server_error'));
      });
  }
});

const deleteApi = async () => {
  const query = route.query as { id: string; sysId: string };
  if (apiDetail) {
    showModal.value = false;
    isButtonDisabled.value = true;
    await apiModule
      .deleteApi(query)
      .then(() => {
        router.push({ path: '/api' });
        isButtonDisabled.value = false;
        toast.success(t('common.delete_success'), {
          toastClassName: ['toast-success-custom-class'],
        });
      })
      .catch((error) => {
        isButtonDisabled.value = false;
        modal().show(t('error.server_error'));
      });
  }
};
</script>

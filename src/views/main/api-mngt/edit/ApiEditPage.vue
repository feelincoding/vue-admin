<template>
  <!-- for progress -->
  <ContentLayout
    :title="$t('api.apiInformationEdit')"
    :subTitle="$t('api.basicInformation') + $t('api.edit')"
    :depth="$t('api.apiManagement')"
    :isShowProgress="isShowProgress"
    id="api-register"
  >
    <!-- for progress -->
    <template v-slot:contents v-if="!isShowProgress">
      <!-- 레이아웃을 제외한 실제 컨텐츠 부분을 넣어주세요 -->
      <div class="form-wrap">
        <ul>
          <TextForm
            :groupNm="$t('api.sysId') + ' :'"
            type="text"
            :required="true"
            v-model:value="requestBody.sysId"
            :disabled="true"
          />
          <TextForm
            :groupNm="$t('api.apiId') + ' :'"
            type="text"
            :required="true"
            v-model:value="requestBody.id"
            :disabled="true"
          />
          <TextForm
            :groupNm="$t('api.interfaceNumber') + ' :'"
            type="text"
            :required="true"
            :disabled="true"
            v-model:value="requestBody.ifNo"
          />

          <MethodForm groupNm="Method" v-model:value="requestBody.meth" v-model:isvalid="methodValid" />
          <UriForm
            groupNm="URI :"
            :uriIn="requestBody.uriIn"
            v-model:value="requestBody.uriOut"
            v-model:isvalid="uriValid"
          />
          <EndPointGroup groupNm="End-point :" :edptList="edptList" />

          <HandlerGroupForm
            :groupNm="$t('api.resHndlrGrp') + ' :'"
            :reqHandlerGroupList="reqHandlerGroupList"
            :resHandlerGroupList="resHandlerGroupList"
            :resHandlerGroupId="requestBody.resHndlrGrpId"
            :reqHandlerGroupId="requestBody.reqHndlrGrpId"
            @reqInput="
              (msg) => {
                requestBody.reqHndlrGrpId = msg;
              }
            "
            @resInput="
              (msg) => {
                requestBody.resHndlrGrpId = msg;
              }
            "
          />
          <TextForm
            :groupNm="$t('api.timeOutMS') + ' :'"
            type="number"
            :required="true"
            v-model:value="requestBody.timeOut"
            v-model:isvalid="timeoutValid"
          />
        </ul>

        <div class="form-wrap option-wrap">
          <h3 class="h3-tit">선택 입력 항목 :</h3>
          <ul>
            <TextForm
              :groupNm="$t('api.apiDescription') + ' :'"
              type="textarea"
              v-model:value="requestBody.desc"
              v-model:isvalid="descValid"
            />
          </ul>
        </div>

        <ModalLayout size="s" v-if="showModal">
          <template v-slot:modalHeader><h1 class="h1-tit">API 수정</h1> </template>
          <template v-slot:modalContainer>
            <p class="text">API를 수정하시겠습니까?</p>
          </template>
          <template v-slot:modalFooter>
            <button class="lg-btn purple-btn" @click="onSubmit">{{ $t('common.ok') }}</button>
            <button class="lg-btn white-btn" @click="showModal = false">{{ $t('common.cancel') }}</button>
          </template>
        </ModalLayout>
      </div>
    </template>
    <!-- for progress -->
    <template v-slot:buttons v-if="!isShowProgress">
      <!-- 레이아웃과 컨텐츠를 제외한 나머지 버튼들을 넣어주세요 -->
      <div class="btn-wrap">
        <!-- <button class="lg-btn purple-btn" @click="handleClickTestSubmitButton">수정테스트</button> -->
        <!-- <button class="lg-btn purple-btn" @click="$router.push({ path: '/api' })">{{ $t('api.edit') }}</button> -->
        <button :disabled="isButtonDisabled" class="lg-btn purple-btn" @click="onClickSubmitButton">
          {{ $t('api.edit') }}
          <b-spinner variant="light" label="Spinning" v-if="isButtonDisabled" small></b-spinner>
        </button>
        <button :disabled="isButtonDisabled" class="lg-btn white-btn" @click="$router.go(-1)">
          {{ $t('common.cancel') }}
        </button>
      </div>
    </template>
  </ContentLayout>
</template>
<script setup lang="ts">
import ContentLayout from '@/components/layout/ContentLayout.vue';
import type { ApiCreateRequestBody, ApiUpdateRequestBody } from '@/types/ApiType';
import type { HandlerGroupDetail } from '@/types/HandlerType';
import HandlerGroupForm from '@/components/api-mngt/register/HandlerGroupForm.vue';
import TextForm from '@/components/api-mngt/register/TextForm.vue';
import MethodForm from '@/components/api-mngt/register/MethodForm.vue';
import UriForm from '@/components/api-mngt/register/UriForm.vue';
import EndPointGroup from '@/components/api-mngt/register/EndPointGroup.vue';
import ApiRepository from '@/repository/ApiRepository';
import type { SystemResponse } from '@/types/SystemType';
import SystemRepository from '@/repository/SystemRepository';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
import axios from 'axios';
import HandlerRepository from '@/repository/HandlerRepository';
import { inject, onMounted, ref, watch, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { modalInjectionKey, type ModalFunction } from '@/plugins/modal/ModalPlugin';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({});
const route = useRoute();
const router = useRouter();
const modal = inject(modalInjectionKey) as ModalFunction;
let apiRepository = new ApiRepository();
let systemRepository = new SystemRepository();
let handlerRepository = new HandlerRepository();

const showModal = ref(false);
const isShowProgress = ref(false);
const apiDetail: Ref<ApiCreateRequestBody | null> = ref(null);
const system: Ref<SystemResponse | null> = ref(null);

const reqHandlerGroupList: Ref<HandlerGroupDetail[]> = ref([]);
const resHandlerGroupList: Ref<HandlerGroupDetail[]> = ref([]);
const edptList: Ref<string[]> = ref([]);

const requestBody: Ref<ApiUpdateRequestBody> = ref({
  sysId: '',
  id: '',
  ifNo: '',
  meth: [],
  uriIn: '',
  uriOut: '',
  reqHndlrGrpId: '',
  resHndlrGrpId: '',
  timeOut: 15000,
  desc: '',
});

const isButtonDisabled = ref(false);
const methodValid = ref(true);
const uriValid = ref(true);
const timeoutValid = ref(true);
const descValid = ref(true);

const fetchApiDetail = async () => {
  const query = route.query as { id: string; sysId: string };
  apiRepository.getApiDetail(query).then((res) => {
    apiDetail.value = res;
  });
};
const fetchReqHandlerGroupList = async () => {
  handlerRepository.getReqHandlerGroupList().then((res) => {
    reqHandlerGroupList.value = res;
  });
};
const fetchResHandlerGroupList = async () => {
  handlerRepository.getResHandlerGroupList().then((res) => {
    resHandlerGroupList.value = res;
  });
};

onMounted(() => {
  isShowProgress.value = true;
  axios
    .all([
      // this.systemModule.getSystemDetail(), api detail 꺼내고 sysId로 sysDetail 콜
      fetchApiDetail(),
      fetchReqHandlerGroupList(),
      fetchResHandlerGroupList(),
    ])
    .then(() => {
      isShowProgress.value = false;
    })
    .catch(() => {
      isShowProgress.value = false;
      modal().show(t('error.server_error'));
    });
});

watch(apiDetail, () => {
  if (apiDetail != null) {
    requestBody.value = {
      sysId: apiDetail.value!!.sysId,
      id: apiDetail.value!!.id,
      ifNo: apiDetail.value!!.ifNo,
      meth: apiDetail.value!!.meth,
      uriIn: apiDetail.value!!.uriIn,
      uriOut: apiDetail.value!!.uriOut,
      reqHndlrGrpId: apiDetail.value!!.reqHndlrGrpId,
      resHndlrGrpId: apiDetail.value!!.resHndlrGrpId,
      timeOut: apiDetail.value!!.timeOut,
      desc: apiDetail.value!!.desc,
    };
    systemRepository
      .getSystemDetail(apiDetail.value!!.sysId)
      .then((res) => {
        system.value = res;
        isShowProgress.value = false;
      })
      .catch(() => {
        isShowProgress.value = false;
        modal().show(t('error.server_error'));
      });
  }
});

watch(system, () => {
  if (system != null) {
    edptList.value = system.value!!.edpt;
  }
});

const onClickSubmitButton = () => {
  const val =
    methodValid.value &&
    uriValid.value &&
    timeoutValid.value &&
    descValid.value &&
    requestBody.value.reqHndlrGrpId &&
    requestBody.value.resHndlrGrpId;
  // const val = true;
  console.log(methodValid.value, uriValid.value, timeoutValid.value, descValid.value);
  if (!val) {
    modal().show(t('api.empty_check_message'));
    return;
  } else {
    showModal.value = true;
  }
};

const onSubmit = async () => {
  isButtonDisabled.value = true;
  showModal.value = false;
  const apiUpdateRequestBody = { ...requestBody.value };
  await apiRepository
    .putApi(apiUpdateRequestBody)
    .then(() => {
      router.back();
    })
    .catch(() => {
      isButtonDisabled.value = false;
      modal().show(t('api.api_register_fail'));
    });
};

const closeModal = () => {
  modal().hide();
};
</script>

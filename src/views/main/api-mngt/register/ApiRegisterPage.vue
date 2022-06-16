<template>
  <ContentLayout
    :title="$t('api.apiRegister')"
    :subTitle="$t('api.basicInformationRegister')"
    :depth="$t('api.apiManagement')"
    id="api-register"
    :isShowProgress="!showPage"
  >
    <template v-slot:contents>
      <div v-if="showPage" class="form-wrap">
        <ul>
          <SelectForm
            :groupNm="$t('api.sysId') + ' :'"
            :optionList="systemIdEdptList.map((item) => item.id)"
            v-model:input="requestBody.sysId"
          />
          <TextDebounceForm
            inputNm="API ID :"
            :check="isDuplicatedId"
            :placeholder="$t('api.idEx')"
            type="text"
            v-model:isvalid="idValid"
            v-model:value="requestBody.id"
            @input="duplicateCheckId"
          />

          <MethodForm groupNm="Method" v-model:value="requestBody.meth" v-model:isvalid="methodValid" />
          <UriForm
            groupNm="URI :"
            :uriIn="requestBody.uriIn"
            v-model:value="requestBody.uriOut"
            v-model:isvalid="uriValid"
          />

          <!-- <SelectSysForm
            :groupNm="$t('api.systemInterlockInformation')"
            :optionList="edptList"
          /> -->
          <EndPointGroup groupNm="End-point :" :edptList="edptList" />
          <HandlerGroupForm
            :reqHandlerGroupList="reqHandlerGroupList"
            :resHandlerGroupList="resHandlerGroupList"
            :reqHandlerGroupId="''"
            :resHandlerGroupId="''"
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
          <h3 class="h3-tit">선택 입력 항목</h3>
          <ul>
            <TextForm
              :groupNm="$t('api.apiDescription') + ' :'"
              type="textarea"
              v-model:value="requestBody.desc"
              v-model:isvalid="descValid"
            />
          </ul>
        </div>
        <ModalLayout size="s" v-if="isShowModal">
          <template v-slot:modalHeader
            ><h1 class="h1-tit">{{ $t('api.apiRegister') }}</h1>
          </template>
          <template v-slot:modalContainer>
            <p class="text">{{ $t('api.confirm_api_register') }}</p>
          </template>
          <template v-slot:modalFooter
            ><button class="lg-btn purple-btn" @click="onSubmit">{{ $t('common.ok') }}</button
            ><button class="lg-btn white-btn" @click="closeModal">{{ $t('common.cancel') }}</button>
          </template>
        </ModalLayout>
      </div>
    </template>
    <template v-slot:buttons>
      <!-- 레이아웃과 컨텐츠를 제외한 나머지 버튼들을 넣어주세요 -->
      <div class="btn-wrap" v-if="showPage">
        <!-- <button class="lg-btn purple-btn" @click="handleClickTestSubmitButton" :disabled="isButtonDisabled">
          등록테스트
        </button> -->
        <button class="lg-btn purple-btn" @click="onClickSubmitButton" :disabled="isButtonDisabled">
          {{ $t('common.register') }}
          <b-spinner variant="light" label="Spinning" v-if="isButtonDisabled" small></b-spinner>
        </button>
        <button class="lg-btn white-btn" @click="$router.go(-1)" :disabled="isButtonDisabled">
          {{ $t('common.cancel') }}
        </button>
      </div>
    </template>
  </ContentLayout>
</template>

<script setup lang="ts">
import ContentLayout from '@/components/layout/ContentLayout.vue';
import type { ApiCreateRequestBody } from '@/types/ApiType';
import type { HandlerGroupDetail } from '@/types/HandlerType';
import HandlerGroupForm from '@/components/api-mngt/register/HandlerGroupForm.vue';
import SelectForm from '@/components/api-mngt/register/SelectForm.vue';
import TextForm from '@/components/api-mngt/register/TextForm.vue';
import MethodForm from '@/components/api-mngt/register/MethodForm.vue';
import UriForm from '@/components/api-mngt/register/UriForm.vue';
import TextDebounceForm from '@/components/api-mngt/register/TextDebounceForm.vue';
import EndPointGroup from '@/components/api-mngt/register/EndPointGroup.vue';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
import { apiValidationCheck } from '@/repository/ApiRepository';
import type { SystemIdEdpt } from '@/types/SystemType';
import SystemModule from '@/repository/SystemRepository';
import ApiModule from '@/repository/ApiRepository';
import HandlerModule from '@/repository/HandlerRepository';
import { inject, onMounted, ref, watch, type Ref } from 'vue';
import { modalInjectionKey, type ModalFunction } from '@/plugins/modal/ModalPlugin';
import { useI18n } from 'vue-i18n';
import router from '@/router';

let systemModule = new SystemModule();
let apiModule = new ApiModule();
let handlerModule = new HandlerModule();

const modal = inject(modalInjectionKey) as ModalFunction;
const { t } = useI18n({});

let initSystemIdEdptList: SystemIdEdpt[] = [
  {
    id: '',
    edpt: [],
  },
];
let reqHandlerGroup: Ref<HandlerGroupDetail[]> = ref([
  {
    id: '',
    hndlr: [],
    desc: '',
  },
]);
let resHandlerGroup: Ref<HandlerGroupDetail[]> = ref([
  {
    id: '',
    hndlr: [],
    desc: '',
  },
]);

const systemIdEdptList: Ref<SystemIdEdpt[]> = ref(initSystemIdEdptList);
const reqHandlerGroupList: Ref<HandlerGroupDetail[]> = ref(reqHandlerGroup);
const resHandlerGroupList: Ref<HandlerGroupDetail[]> = ref(resHandlerGroup);

const showPage = ref(false);
const idValid = ref(false);
const methodValid = ref(false);
const uriValid = ref(false);
const timeoutValid = ref(true);
const descValid = ref(true);
const isDuplicatedId: Ref<boolean | null> = ref(null);
const isShowModal = ref(false);
const isButtonDisabled = ref(false);

const edptList = ref([] as string[]);
const requestBody: Ref<ApiCreateRequestBody> = ref({
  sysId: '',
  id: '',
  meth: [],
  uriIn: '',
  uriOut: '',
  reqHndlrGrpId: '',
  resHndlrGrpId: '',
  timeOut: 15000,
  desc: '',
});

let timerId = -1;

const fetchApiDetail = async () => {
  systemModule.getSystemIdEdptList().then((res) => {
    systemIdEdptList.value = res;
  });
};

const fetchReqHandlerGroupList = async () => {
  handlerModule.getReqHandlerGroupList().then((res) => {
    reqHandlerGroupList.value = res;
  });
};

const fetchResHandlerGroupList = async () => {
  handlerModule.getResHandlerGroupList().then((res) => {
    resHandlerGroupList.value = res;
  });
};

onMounted(() => {
  Promise.all([fetchApiDetail(), fetchReqHandlerGroupList(), fetchResHandlerGroupList()])
    .then(() => {
      showPage.value = true;
    })
    .catch((error) => {
      console.log(error);
    });
});

watch(
  () => requestBody.value.sysId,
  (val: string) => {
    const selectedSystem = systemIdEdptList.value.filter((item) => item.id === val)?.[0];
    edptList.value = selectedSystem.edpt;
    requestBody.value.id = '';
    requestBody.value.uriIn = '';
    requestBody.value.uriOut = '';
    idValid.value = false;
  }
);

watch(
  () => isDuplicatedId.value,
  () => {
    if (isDuplicatedId.value) {
      requestBody.value.uriIn = '/' + requestBody.value.sysId + '/v1/' + requestBody.value.id;
      requestBody.value.uriOut = '/' + requestBody.value.sysId + '/v1/' + requestBody.value.id;
      uriValid.value = true;
    }
  }
);

const duplicateCheckId = () => {
  isDuplicatedId.value = null;

  if (timerId !== -1) {
    clearTimeout(timerId);
  }

  timerId = setTimeout(async () => {
    isDuplicatedId.value = await apiValidationCheck(requestBody.value.id, requestBody.value.sysId);
  }, 1000);
};

const onClickSubmitButton = () => {
  const val =
    isDuplicatedId.value &&
    idValid.value &&
    methodValid.value &&
    uriValid.value &&
    timeoutValid.value &&
    descValid.value &&
    requestBody.value.reqHndlrGrpId.length > 0 &&
    requestBody.value.resHndlrGrpId.length > 0;
  // const val = true;
  if (!val) {
    modal().show(t('api.empty_check_message'));
    return;
  } else {
    isShowModal.value = true;
  }
};

const onSubmit = async () => {
  isButtonDisabled.value = true;
  isShowModal.value = false;
  const apiCreateRequestBody = { ...requestBody.value };
  await apiModule
    .postApi(apiCreateRequestBody)
    .then(() => {
      router.push('/api');
    })
    .catch(() => {
      isButtonDisabled.value = false;
      modal().show(t('api.api_edit_fail'));
    });
};

const closeModal = () => {
  isShowModal.value = false;
};
</script>

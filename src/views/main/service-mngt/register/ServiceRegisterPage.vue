<template>
  <div>
    <ContentLayout
      :title="$t('service.register')"
      :subTitle="$t('service.register_sub_title')"
      :depth="$t('service.title')"
      :isShowProgress="isShowProgress"
    >
      <template v-if="!isShowProgress" v-slot:contents>
        <ul>
          <TextDebounceForm
            type="text"
            :inputNm="$t('service.id')"
            :check="isDuplicatedId"
            :placeholder="$t('service.idEx')"
            v-model:value="formData.id"
            @input="duplicateCheckId()"
            v-model:isValid="idValid"
          />
          <DateGroup
            :inputNm="$t('service.date')"
            placeholderStart="YYYY-MM-DD"
            v-model:startDt="formData.svcStDt"
            v-model:endDt="formData.svcEndDt"
            v-model:isValid="dateValid"
          />
          <AuthReqGroup
            @basicAuthClicked="basicAuthClicked"
            :inputNm="$t('service.authentication_method')"
            :basicId="formData.athn.basic.id"
            :basicPw="formData.athn.basic.pw"
            v-model:athn="formData.athnType"
            v-model:alg="jwtAlgList"
            v-model:pickedAlg="formData.athn.jwt.alg"
            v-model:issuer="formData.athn.jwt.iss"
            v-model:subject="formData.athn.jwt.aud"
            v-model:publicKey="formData.athn.jwt.pubKey"
            v-model:isValid="authValid"
            :progress="isBasicAuthProgress"
          />
          <ApiAuthReqGroup inputNm="권한설정" @showApiAuth="showApiAuth" :setCheck="apiAuthValid" />
          <SlaReqGroup
            :inputNm="$t('service.SLA_mngt')"
            v-model:secVal="formData.sla.sec"
            v-model:minVal="formData.sla.min"
            v-model:hourVal="formData.sla.hr"
            v-model:dayVal="formData.sla.day"
            v-model:monthVal="formData.sla.mon"
            v-model:onSec="slaSec"
            v-model:onMin="slaMin"
            v-model:onHr="slaHr"
            v-model:onDay="slaDay"
            v-model:onMon="slaMon"
          />
          <InputGroup
            type="text"
            :inputNm="$t('service.tkcgrNm')"
            :placeholder="$t('service.tkcgrNmEx')"
            v-model:value="formData.tkcgrNm"
            v-model:isValid="tkcgrNmValid"
          />
          <InputGroup
            type="text"
            :inputNm="$t('service.tkcgrPos')"
            :placeholder="$t('service.tkcgrPosEx')"
            v-model:value="formData.tkcgrPos"
            v-model:isValid="tkcgrPosValid"
          />
          <InputGroup
            type="text"
            :inputNm="$t('service.tkcgrEml')"
            placeholder="kt0601@kt.com"
            inputClass="input-box lg check-ok"
            v-model:value="formData.tkcgrEml"
            v-model:isValid="tkcgrEmlValid"
          />
          <SysExGroup :inputNm="$t('service.desc')" v-model:value="formData.desc" />
          <ModalLayout size="s" v-if="registerModal">
            <template v-slot:modalHeader
              ><h2 class="h1-tit">{{ $t('service.register') }}</h2>
            </template>
            <template v-slot:modalContainer>
              <p v-if="!isRegisterProgress" class="text">{{ $t('service.register_message') }}</p>
              <div v-if="isRegisterProgress" style="width: 100%; text-align: center">
                <b-spinner
                  v-show="isRegisterProgress"
                  style="width: 2.5rem; height: 2.5rem"
                  label="Large Spinner"
                ></b-spinner>
              </div>
            </template>
            <template v-slot:modalFooter
              ><button class="lg-btn purple-btn" @click="submit()">
                {{ $t('common.ok') }}</button
              ><button class="lg-btn white-btn" @click="modalHide()">
                {{ $t('common.cancel') }}
              </button>
            </template>
          </ModalLayout>
        </ul>
      </template>
      <template v-if="!isShowProgress" v-slot:buttons>
        <div class="btn-wrap">
          <button class="lg-btn purple-btn" @click="modalShow()" :disabled="isRegisterProgress">
            {{ $t('common.register') }}
            <b-spinner variant="light" v-show="isRegisterProgress" small></b-spinner>
          </button>
          <button class="lg-btn white-btn" @click="$router.go(-1)" :disabled="isRegisterProgress">
            {{ $t('common.cancel') }}
          </button>
        </div>
      </template>
    </ContentLayout>

    <ApiAuthModal
      :setApiList="apiList"
      :setCheckedApiList="checkedApiList"
      :setIsApiAuthProgress="isApiAuthProgress"
      :setShowApiAuthModal="showApiAuthModal"
      :setCountApiList="countApiList"
      @checkApiAll="checkApiAll"
      @checkApi="checkApi"
      @deleteApi="deleteApi"
      @searchApi="searchApi"
      @registerApi="registerApi"
      @hideApiAuth="hideApiAuth"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, inject } from 'vue';
import type { Ref } from 'vue';
import ContentLayout from '@/components/layout/ContentLayout.vue';
import InputGroup from '@/components/service-mngt/InputGroup.vue';
import DateGroup from '@/components/service-mngt/DateGroup.vue';
import AuthReqGroup from '@/components/service-mngt/AuthReqGroup.vue';
import SlaReqGroup from '@/components/service-mngt/SlqReqGroup.vue';
import SysExGroup from '@/components/service-mngt/SysExGroup.vue';
import type { ServiceRegisterRequest, ApiAuthResponse } from '@/types/ServiceType';
import TextDebounceForm from '@/components/service-mngt/TextDebounceForm.vue';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
import ApiAuthModal from '@/components/service-mngt/ApiAuthModal.vue';
import ApiAuthReqGroup from '@/components/service-mngt/ApiAuthReqGroup.vue';
import ServiceRepository from '@/repository/service-repository';
import { modalInjectionKey, type ModalFunction } from '@/plugins/modal/ModalPlugin';

import router from '@/router';
import bootstrap from 'bootstrap-vue-3';
import { BSpinner } from 'bootstrap-vue-3';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const toast = useToast();
const modal = inject(modalInjectionKey) as ModalFunction;
const serviceRepository = new ServiceRepository();
const jwtAlgList: Ref<string[]> = ref([]);
const apiAuthList: Ref<ApiAuthResponse[]> = ref([] as ApiAuthResponse[]);
const apiList: Ref<ApiAuthResponse[]> = ref([]);
const checkedApiList: Ref<ApiAuthResponse[]> = ref([]);
const countApiList = ref(0);
const showApiAuthModal = ref(false);

const isBasicAuthProgress = ref(false);
const isRegisterProgress = ref(false);
const isShowProgress = ref(false);
const isApiAuthProgress = ref(false);

const isBtnDisabled = ref(true);
const idValid = ref(false);
const tkcgrNmValid = ref(true);
const tkcgrPosValid = ref(true);
const tkcgrEmlValid = ref(true);
const dateValid = ref(false);
const authValid = ref(false);
const apiAuthValid = ref(false);
const slaSec = ref(false);
const slaMin = ref(false);
const slaHr = ref(false);
const slaDay = ref(false);
const slaMon = ref(false);

const registerModal = ref(false);
const timerId = ref(0);
const isDuplicatedId: Ref<boolean | null> = ref(null);
const formData: Ref<ServiceRegisterRequest> = ref({
  id: '',
  tkcgrNm: null,
  tkcgrPos: null,
  tkcgrEml: null,
  sla: { sec: null, min: null, hr: null, day: null, mon: null },
  svcStDt: '',
  svcEndDt: '',
  athnType: 'basic',
  athn: {
    basic: {
      id: null,
      pw: null,
    },
    jwt: {
      alg: null,
      iss: null,
      aud: null,
      pubKey: null,
    },
  },
  apiAut: [],
  desc: null,
});

watch(
  () => formData.value.athnType,
  (val) => {
    if (val == 'basic') {
      formData.value.athn.jwt = {
        alg: null,
        iss: null,
        aud: null,
        pubKey: null,
      };
    } else {
      formData.value.athn.basic = {
        id: null,
        pw: null,
      };
    }
  }
);

const modalShow = () => {
  const val =
    idValid.value &&
    tkcgrNmValid.value &&
    tkcgrPosValid.value &&
    tkcgrEmlValid.value &&
    dateValid.value &&
    authValid.value &&
    apiAuthValid.value &&
    isDuplicatedId.value
      ? true
      : false;

  if (!val) {
    modal().show(t('service.empty_check_message'));
    return;
  } else {
    if (
      (slaSec.value == true && formData.value.sla.sec == null) ||
      (slaMin.value == true && formData.value.sla.min == null) ||
      (slaHr.value == true && formData.value.sla.hr == null) ||
      (slaDay.value == true && formData.value.sla.day == null) ||
      (slaMon.value == true && formData.value.sla.mon == null) ||
      (slaSec.value == true && formData.value.sla.sec == 0) ||
      (slaMin.value == true && formData.value.sla.min == 0) ||
      (slaHr.value == true && formData.value.sla.hr == 0) ||
      (slaDay.value == true && formData.value.sla.day == 0) ||
      (slaMon.value == true && formData.value.sla.mon == 0) ||
      formData.value.apiAut == []
    ) {
      modal().show(t('service.empty_check_message'));
    } else {
      registerModal.value = true;
    }
  }
};

const modalHide = () => {
  registerModal.value = false;
};

const submit = () => {
  registerModal.value = false;
  isRegisterProgress.value = true;
  serviceRepository
    .createService(formData.value)
    .then(() => {
      router.push({ path: '/service' });
      toast.success(t('common.register_success'), {
        toastClassName: ['toast-success-custom-class'],
      });
    })
    .catch(() => {
      isRegisterProgress.value = false;
      modal().show(t('error.server_error'));
    });
};

const duplicateCheckId = () => {
  if (timerId.value) {
    isDuplicatedId.value = null;
    clearTimeout(timerId.value);
  }
  timerId.value = setTimeout(async () => {
    await serviceRepository.getDuplicatedCheckId(formData.value.id).then((res) => {
      isDuplicatedId.value = res.value.isPkDuplicated;
    });
  }, 500);
};

const basicAuthClicked = () => {
  isBasicAuthProgress.value = true;

  serviceRepository
    .getBasicAuth(formData.value.id)
    .then((res) => {
      formData.value.athn.basic.id = res.value.id;
      formData.value.athn.basic.pw = res.value.pw;
      isBasicAuthProgress.value = false;
    })
    .catch(() => {
      isBasicAuthProgress.value = false;
      modal().show(t('error.server_error'));
    });
};

const showApiAuth = () => {
  showApiAuthModal.value = true;
  isApiAuthProgress.value = true;
  serviceRepository
    .getApiAuthList()
    .then((res) => {
      isApiAuthProgress.value = false;
      apiAuthList.value = res.value;
      apiList.value = apiAuthList.value.map((item) => {
        return { ...item };
      });
      checkedApiList.value = formData.value.apiAut.map((item) => {
        return { ...item };
      });
      countApiList.value = 0;
      checkedApiList.value.forEach((api) => {
        countApiList.value += api.apiId.length;
      });
    })
    .catch(() => {
      isApiAuthProgress.value = false;
    });
};

const hideApiAuth = () => {
  showApiAuthModal.value = false;
  if (formData.value.apiAut.length == 0) {
    apiAuthValid.value = false;
  } else {
    apiAuthValid.value = true;
  }
};
const checkApi = ({ sys, api }: any) => {
  if (checkedApiList.value.find((item) => item.sysId === sys)) {
    if (checkedApiList.value[checkedApiList.value.findIndex((item) => item.sysId === sys)].apiId.includes(api)) {
      if (checkedApiList.value[checkedApiList.value.findIndex((item) => item.sysId === sys)].apiId.length === 1) {
        checkedApiList.value = checkedApiList.value.filter((item) => item.sysId !== sys);
      } else {
        checkedApiList.value[checkedApiList.value.findIndex((item) => item.sysId === sys)].apiId = checkedApiList.value[
          checkedApiList.value.findIndex((item) => item.sysId === sys)
        ].apiId.filter((item) => item !== api);
      }
      countApiList.value--;
    } else {
      checkedApiList.value[checkedApiList.value.findIndex((item) => item.sysId === sys)].apiId.push(api);
      countApiList.value++;
    }
  } else {
    checkedApiList.value.push({ sysId: sys, apiId: [api] });
    countApiList.value++;
  }
  checkedApiList.value.sort(function (a, b) {
    // 오름차순
    return a.sysId < b.sysId ? -1 : a.sysId > b.sysId ? 1 : 0;
  });
};

const deleteApi = ({ sys, api }: any) => {
  if (checkedApiList.value[checkedApiList.value.findIndex((item) => item.sysId === sys)].apiId.length == 1) {
    checkedApiList.value = checkedApiList.value.filter((item) => item.sysId !== sys);
  } else {
    checkedApiList.value[checkedApiList.value.findIndex((item) => item.sysId === sys)].apiId = checkedApiList.value[
      checkedApiList.value.findIndex((item) => item.sysId === sys)
    ].apiId.filter((item) => item !== api);
  }
  countApiList.value--;
  checkedApiList.value.sort(function (a, b) {
    // 오름차순
    return a.sysId < b.sysId ? -1 : a.sysId > b.sysId ? 1 : 0;
  });
};

const checkApiAll = (apiAll: ApiAuthResponse) => {
  if (checkedApiList.value.find((item) => item.sysId === apiAll.sysId)) {
    if (checkedApiList.value.find((item) => item.sysId === apiAll.sysId)?.apiId.length === apiAll.apiId.length) {
      countApiList.value = countApiList.value - apiAll.apiId.length;
      checkedApiList.value = checkedApiList.value.filter((item) => item.sysId !== apiAll.sysId);
    } else {
      countApiList.value =
        countApiList.value -
        checkedApiList.value[checkedApiList.value.findIndex((item) => item.sysId === apiAll.sysId)].apiId.length +
        apiAll.apiId.length;
      checkedApiList.value[checkedApiList.value.findIndex((item) => item.sysId === apiAll.sysId)].apiId = apiAll.apiId;
    }
  } else {
    checkedApiList.value.push({ sysId: apiAll.sysId, apiId: apiAll.apiId });
    countApiList.value = countApiList.value + apiAll.apiId.length;
  }
  checkedApiList.value.sort(function (a, b) {
    // 오름차순
    return a.sysId < b.sysId ? -1 : a.sysId > b.sysId ? 1 : 0;
  });
};

const searchApi = (searchText: string) => {
  if (searchText !== '') {
    apiList.value = apiAuthList.value.map((item) => {
      return { ...item };
    });
    apiList.value.forEach((api, index) => {
      apiList.value[index].apiId = apiList.value[index].apiId.filter((item) =>
        item.toUpperCase().includes(searchText.toUpperCase())
      );
    });
    apiList.value = apiList.value.filter((item) => item.apiId.length !== 0);
  } else {
    apiList.value = apiAuthList.value.map((item) => {
      return { ...item };
    });
  }
};

const registerApi = (api: ApiAuthResponse[]) => {
  formData.value.apiAut = api;
  showApiAuthModal.value = false;
  if (api.length == 0) {
    apiAuthValid.value = false;
  } else {
    apiAuthValid.value = true;
  }
};

onMounted(() => {
  isShowProgress.value = true;
  serviceRepository
    .getJWTAlg()
    .then((res) => {
      jwtAlgList.value = res.value;
      isShowProgress.value = false;
    })
    .catch(() => {
      isShowProgress.value = false;
      modal().show(t('error.server_error'));
    });
});
</script>

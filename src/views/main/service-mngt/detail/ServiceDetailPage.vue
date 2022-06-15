<template>
  <div>
    <ContentLayout
      :isShowProgress="isShowProgress"
      :title="$t('service.detail_title')"
      :subTitle="$t('service.detail_sub_title')"
      :depth="$t('service.title')"
      :isEmShow="false"
    >
      <template v-if="!isShowProgress" v-slot:contents>
        <div class="form-wrap">
          <ul>
            <InfoGroup :inputNm="$t('service.id')" :value="service.id" />
            <DateInfoGroup
              :inputNm="$t('service.date')"
              :startDt="getDate(service.svcStDt)"
              :endDt="getDate(service.svcEndDt)"
            />
            <AuthGroup
              :inputNm="$t('service.authentication_method')"
              :athn="service.athnType"
              :id="service.athn.basic.id"
              :pw="service.athn.basic.pw"
              :alg="service.athn.jwt.alg"
              :iss="service.athn.jwt.iss"
              :aud="service.athn.jwt.aud"
              :pubKey="service.athn.jwt.pubKey"
            />
            <ApiAuthGroup
              :inputNm="$t('service.api_mngt')"
              :countApiList="countApiList"
              @setShowApiAuth="showApiAuth"
            />
            <SlaGroup
              :inputNm="$t('service.SLA_mngt')"
              :secVal="service.sla.sec"
              :minVal="service.sla.min"
              :hourVal="service.sla.hr"
              :dayVal="service.sla.day"
              :monthVal="service.sla.mon"
            />
            <InfoGroup :inputNm="$t('service.tkcgrNm')" :value="service.tkcgrNm" />
            <InfoGroup :inputNm="$t('service.tkcgrPos')" :value="service.tkcgrPos" />
            <InfoGroup :inputNm="$t('service.tkcgrEml')" :value="service.tkcgrEml" />
            <InfoGroup :inputNm="$t('service.desc')" :value="service.desc" />
            <ModalLayout size="s" v-if="deleteModal">
              <template v-slot:modalHeader
                ><h1 class="h1-tit">{{ $t('service.delete') }}</h1>
              </template>
              <template v-slot:modalContainer>
                <p class="text">{{ $t('service.delete_message') }}</p>
              </template>
              <template v-slot:modalFooter
                ><button class="lg-btn purple-btn" @click="deleteService(deleteId)">{{ $t('common.ok') }}</button
                ><button class="lg-btn white-btn" @click="modalHide()">{{ $t('common.cancel') }}</button>
              </template>
            </ModalLayout>
          </ul>
        </div>
      </template>

      <template v-if="!isShowProgress" v-slot:buttons>
        <div class="btn-wrap">
          <button
            class="lg-btn purple-btn"
            @click="$router.push({ name: 'service-edit', params: { id: $route.params.id } })"
            :disabled="isRegisterProgress"
          >
            {{ $t('common.modify') }}
          </button>
          <button class="lg-btn white-btn" @click="modalShow(service.id)" :disabled="isRegisterProgress">
            {{ $t('common.delete') }}
            <b-spinner v-show="isRegisterProgress" small></b-spinner>
          </button>
          <button class="lg-btn gray-btn" @click="$router.back()" :disabled="isRegisterProgress">
            {{ $t('common.list') }}
          </button>
        </div>
      </template>
    </ContentLayout>
    <ApiAuthVueModal
      :setCheckedApiList="service.apiAut"
      :setIsApiAuthProgress="isApiAuthProgress"
      :setShowApiAuthModal="showApiAuthModal"
      :setCountApiList="countApiList"
      @hideApiAuth="hideApiAuth"
    ></ApiAuthVueModal>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
import type { Ref } from 'vue';
import InfoGroup from '@/components/service-mngt/InfoGroup.vue';
import DateInfoGroup from '@/components/service-mngt/DateInfoGroup.vue';
import AuthGroup from '@/components/service-mngt/AuthGroup.vue';
import SlaGroup from '@/components/service-mngt/SlaGroup.vue';
import ContentLayout from '@/components/layout/ContentLayout.vue';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
import ApiAuthVueModal from '@/components/service-mngt/ApiAuthVueModal.vue';
import ApiAuthGroup from '@/components/service-mngt/ApiAuthGroup.vue';
import { convertDate } from '@/utils/converter';
import type { ServiceResponse } from '@/types/ServiceType';
import ServiceRepository from '@/repository/ServiceRespository';

import { useRoute } from 'vue-router';
import router from '@/router';
import bootstrap from 'bootstrap-vue-3';
import { BSpinner } from 'bootstrap-vue-3';
import { modalInjectionKey, type ModalFunction } from '@/plugins/modal/ModalPlugin';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const toast = useToast();
const modal = inject(modalInjectionKey) as ModalFunction;
const route = useRoute();
const serviceRepositry = new ServiceRepository();
const isShowProgress = ref(false);
const isRegisterProgress = ref(false);
const countApiList = ref(0);
const deleteModal = ref(false);
const deleteId = ref('');
const showApiAuthModal = ref(false);
const isApiAuthProgress = ref(false);
const service: Ref<ServiceResponse> = ref({
  id: '',
  tkcgrNm: null,
  tkcgrPos: null,
  tkcgrEml: null,
  svcStDt: '',
  svcEndDt: '',
  athnType: '',
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
  sla: { sec: null, min: null, hr: null, day: null, mon: null },
  apiAut: [],
  desc: '',
  updId: '',
  updDt: '',
  cretDt: '',
  cretId: '',
});

const getDate = (date: string) => {
  return convertDate(date);
};

const deleteService = (id: string) => {
  deleteModal.value = false;
  isRegisterProgress.value = true;
  serviceRepositry
    .deleteService(id)
    .then(() => {
      router.back();
      deleteModal.value = false;
      toast.success(t('common.delete_success'), {
        toastClassName: ['toast-success-custom-class'],
      });
    })
    .catch(() => {
      isRegisterProgress.value = false;
      modal().show(`${t('error.server_error')}`);
    });
};

const modalShow = (id: string) => {
  deleteId.value = id;
  deleteModal.value = true;
};
const modalHide = () => {
  deleteModal.value = false;
};

const showApiAuth = () => {
  showApiAuthModal.value = true;
  isApiAuthProgress.value = true;
};
const hideApiAuth = () => {
  showApiAuthModal.value = false;
};
onMounted(() => {
  isShowProgress.value = true;
  serviceRepositry
    .getService(route.params.id as string)
    .then((res) => {
      isShowProgress.value = false;
      service.value = res.value;
      service.value.apiAut.forEach((api) => {
        countApiList.value += api.apiId.length;
      });
    })
    .catch(() => {
      modal().show(t('api.server_error'));
      isShowProgress.value = false;
    });
});
</script>

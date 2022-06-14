<template>
  <ContentLayout
    :isShowProgress="isShowProgress"
    :title="$t('system.detail_top_title')"
    :subTitle="$t('system.detail_cont_title')"
    :depth="$t('system.detail_depth')"
    :isEmShow="isEmShow"
  >
    <template v-if="!isShowProgress" v-slot:contents>
      <section class="contents-wrap box">
        <div class="form-wrap">
          <ul>
            <InfoGroup :inputNm="$t('system.id')" :value="systemItem.id" />

            <IfFormlGroup :inputNm="$t('system.edpt')" :endPoints="systemItem.edpt" />
            <InfoGroup :inputNm="$t('system.tkcgrNm')" :value="systemItem.tkcgrNm" />
            <InfoGroup :inputNm="$t('system.tkcgrPos')" :value="systemItem.tkcgrPos" />
            <InfoGroup :inputNm="$t('system.tkcgrEml')" :value="systemItem.tkcgrEml" />
            <InfoGroup :inputNm="$t('system.desc')" :value="systemItem.desc" />
            <ModalLayout size="s" v-if="isShowModal">
              <template v-slot:modalHeader
                ><h1 class="h1-tit">{{ $t('system.modal_system_delete') }}</h1>
              </template>
              <template v-slot:modalContainer>
                <p class="text">{{ $t('system.modal_delete_message') }}</p>
              </template>
              <template v-slot:modalFooter>
                <button class="lg-btn purple-btn" @click="onClickDelete">{{ $t('common.ok') }}</button>
                <button class="lg-btn white-btn" @click="closeModal">{{ $t('common.cancel') }}</button>
              </template>
            </ModalLayout>
          </ul>
        </div>
      </section>
    </template>
    <template v-if="!isShowProgress" v-slot:buttons>
      <div class="btn-wrap" v-if="!isShowProgress">
        <button class="lg-btn purple-btn" @click="onClickEdit" :disabled="isDisabled">{{ $t('common.modify') }}</button>
        <button class="lg-btn white-btn" @click="showModal" :disabled="isDisabled">
          {{ $t('common.delete') }}
          <b-spinner label="Spinning" v-if="isDisabled" small></b-spinner>
        </button>
        <button class="lg-btn gray-btn" @click="onClickPrevious" :disabled="isDisabled">{{ $t('common.list') }}</button>
      </div>
    </template>
  </ContentLayout>
</template>

<script setup lang="ts">
import type { SystemResponse } from '@/types/SystemType';
import SystemModule from '@/repository/system-repository';

import ContentLayout from '@/components/layout/ContentLayout.vue';
import InfoGroup from '@/components/system-mngt/detail/InfoGroup.vue';
import IfFormlGroup from '@/components/system-mngt/detail/IfFormlGroup.vue';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
// import { GateWayError } from '@/error/GateWayError';
import ErrorCode from '@/error/ErrorCodes';

import { ref, onMounted, inject } from 'vue';

import { BSpinner } from 'bootstrap-vue-3';

import { useRoute } from 'vue-router';
import router from '@/router';
import { modalInjectionKey } from '@/plugins/modal/ModalPlugin';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
const toast = useToast();
const { t } = useI18n({});
const route = useRoute();
const modal = inject(modalInjectionKey)!!;

const props = defineProps({
  id: { type: String, required: false, default: '' },
});
const systemModule = new SystemModule();
const systemItem = ref<SystemResponse>({} as SystemResponse);

const isShowProgress = ref(false);
const isShowModal = ref(false);
const isDisabled = ref(false);
const isEmShow = ref(false);

onMounted(() => {
  isShowProgress.value = true;
  systemModule
    .getSystemDetail(route.params.id as string)
    .then((res) => {
      isShowProgress.value = false;

      // this.systemItem = this.system;
      systemItem.value = res;
    })
    .catch((error) => {
      if (error.getErrorCode() == ErrorCode.NETWORK_ERROR) {
        modal().show(t('error.server_error'));
      } else {
        modal().show(t('error.server_error'));
      }
    });
});

const onClickPrevious = () => {
  router.go(-1);
};

const onClickEdit = () => {
  router.push({ name: 'system-edit', params: { id: route.params.id } });
};

const onClickDelete = async () => {
  isDisabled.value = true;
  isShowModal.value = false;

  await systemModule
    .deleteSystem(route.params.id as string)
    .then(() => {
      isDisabled.value = false;
      router.push({ name: 'system' });
      toast.success(t('common.delete_success'), {
        toastClassName: ['toast-success-custom-class'],
      });
    })
    .catch((error) => {
      isDisabled.value = false;
      if (error.getErrorCode() == ErrorCode.SYSTEM_DELETE_FAILED) {
        toast.error(t('system.system_delete_fail', { system_name: route.params.id }));
      }
    });
};

const showModal = () => {
  isShowModal.value = true;
};

const closeModal = () => {
  isShowModal.value = false;
};
</script>

<style scoped></style>

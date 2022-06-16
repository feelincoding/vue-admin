<template>
  <ContentLayout
    :isShowProgress="isShowProgress"
    :title="$t('system.modify_top_title')"
    :subTitle="$t('system.modify_cont_title')"
    :depth="$t('system.modify_depth')"
  >
    <template v-if="!isShowProgress" v-slot:contents>
      <div class="form-wrap">
        <ul>
          <TextDebounceForm
            type="text"
            :inputNm="$t('system.id')"
            :check="isDuplicatedId"
            :placeholder="$t('system.id_placeholder')"
            v-model:value="systemItem.id"
            v-model:isValid="idValid"
            :disabled="true"
          />

          <EdptForm
            :inputNm="$t('system.edpt')"
            v-model:strArr.sync="systemItem.edpt"
            v-model:isValid.sync="edptValid"
            :editPage="true"
          />
          <InputGroup
            type="text"
            v-model:value.sync="systemItem.tkcgrNm"
            v-model:isValid.sync="tkcgrNmValid"
            :inputNm="$t('system.tkcgrNm')"
            :place="$t('system.tkcgrNm')"
          />

          <InputGroup
            type="text"
            v-model:value.sync="systemItem.tkcgrPos"
            :inputNm="$t('system.tkcgrPos')"
            :place="$t('system.tkcgrPos')"
            v-model:isValid.sync="tkcgrPosValid"
          />
          <InputGroup
            type="email"
            v-model:value.sync="systemItem.tkcgrEml"
            :inputNm="$t('system.tkcgrEml')"
            :place="$t('system.tkcgrEml')"
            v-model:isValid.sync="tkcgrEmlValid"
          />
          <TextAreaGroup :inputNm="$t('system.desc')" v-model:value.sync="systemItem.desc" />
        </ul>
        <ModalLayout size="s" v-if="isShowModal">
          <template v-slot:modalHeader
            ><h1 class="h1-tit">{{ $t('system.modal_system_edit') }}</h1>
          </template>
          <template v-slot:modalContainer>
            <p class="text">{{ $t('system.modal_edit_message') }}</p>
          </template>
          <template v-slot:modalFooter
            ><button class="lg-btn purple-btn" @click="onSubmit">{{ $t('common.ok') }}</button
            ><button class="lg-btn white-btn" @click="closeModal">{{ $t('common.cancel') }}</button>
          </template>
        </ModalLayout>
      </div>
    </template>
    <template v-slot:buttons v-if="!isShowProgress">
      <div class="btn-wrap">
        <button class="lg-btn purple-btn" @click="test" :disabled="isBtnDisabled">
          등록테스트
          <b-spinner variant="light" label="Spinning" v-if="isBtnDisabled" small></b-spinner>
        </button>
        <button class="lg-btn purple-btn" @click="showModal" :disabled="isBtnDisabled">
          {{ $t('common.modify') }}
          <b-spinner variant="light" label="Spinning" v-if="isBtnDisabled" small></b-spinner>
        </button>
        <button class="lg-btn white-btn" @click="cancelOnClickEvent" :disabled="isBtnDisabled">
          {{ $t('common.cancel') }}
        </button>
      </div>
    </template>
  </ContentLayout>
</template>
<script setup lang="ts">
import type { SystemResponse } from '@/types/SystemType';

import SystemModule from '@/repository/SystemRepository';

import ContentLayout from '@/components/layout/ContentLayout.vue';
import InputGroup from '@/components/system-mngt/InputGroup.vue';
import TextAreaGroup from '@/components/system-mngt/TextAreaGroup.vue';
import EdptForm from '@/components/system-mngt/EdptForm.vue';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
import TextDebounceForm from '@/components/system-mngt/TextDebounceForm.vue';

import { ref, reactive, computed, watch, onMounted, inject } from 'vue';
import type { PropType } from 'vue';
import type { Ref } from 'vue';

import { BSpinner } from 'bootstrap-vue-3';

import { useRoute, useRouter } from 'vue-router';
import { modalInjectionKey } from '@/plugins/modal/ModalPlugin';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import ErrorCode from '@/error/ErrorCodes';
const toast = useToast();
const { t } = useI18n({});
const route = useRoute();
const router = useRouter();

const modal = inject(modalInjectionKey)!!;

const systemModule = new SystemModule();

const systemItem = ref<SystemResponse>({} as SystemResponse);

const idValid = ref(true);
const tkcgrNmValid = ref(true);
const tkcgrPosValid = ref(true);
const tkcgrEmlValid = ref(true);
const edptValid = ref(true);

const isShowProgress = ref(false);
const isShowModal = ref(false);
const isBtnDisabled = ref(false);

const isDuplicatedId: Ref<boolean | null> = ref(null);
const test = () => {
  console.log('test value: ', systemItem.value);
};

onMounted(() => {
  isShowProgress.value = true;

  systemModule
    .getSystemDetail(route.params.id as string)
    .then((res) => {
      isShowProgress.value = false;

      systemItem.value = res;
    })
    .catch(() => {
      isShowProgress.value = false;
      modal().show(t('error.server_error'));
    });
});

const showModal = () => {
  const val = idValid.value && edptValid.value ? true : false;

  if (!val) {
    modal().show(t('system.empty_check_message'));
    return;
  } else {
    isShowModal.value = true;
  }
};

const closeModal = () => {
  isShowModal.value = false;
};

const onSubmit = async () => {
  isBtnDisabled.value = true;
  isShowModal.value = false;
  systemModule
    .updateSystemDetail(systemItem.value)
    .then(() => {
      toast.success(t('system.edit_success'));
      isShowProgress.value = false;
      router.back();
    })
    .catch((err) => {
      isShowProgress.value = false;
      if (err.getErrorCode() == ErrorCode.CANCEL_ERROR) {
        console.log('SYSTEM API Cancel');
      } else {
        modal().show(t('error.server_error'));
      }
    });
};

const cancelOnClickEvent = () => {
  router.go(-1);
};
</script>

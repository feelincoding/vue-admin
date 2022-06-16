<template>
  <ContentLayout
    :title="$t('system.add_top_title')"
    :subTitle="$t('system.add_cont_title')"
    :depth="$t('system.add_depth')"
  >
    <template v-slot:contents>
      <div class="form-wrap">
        <ul>
          <TextDebounceForm
            type="text"
            :inputNm="$t('system.id')"
            :check="isDuplicatedId"
            :placeholder="$t('system.id_placeholder')"
            v-model:value="systemItem.id"
            @input="duplicateCheckId()"
            v-model:isValid="idValid"
          />
          <!-- <TextDebounceForm
          type="text"
          :check="isDuplicatedId"
          v-model="systemItem.id"
          v-model:isValid.sync="idValid"
          :inputNm="$t('system.id')"
          :placeholder="$t('system.id_placeholder')"
          :required="true"
          @input="duplicateCheckId"
        /> -->
          <EdptForm
            :inputNm="$t('system.edpt')"
            v-model:strArr.sync="systemItem.edpt"
            v-model:isValid.sync="edptValid"
          />
        </ul>
      </div>

      <div class="form-wrap option-wrap">
        <h3 class="h3-tit">선택 입력 항목</h3>
        <ul>
          <InputGroup
            type="text"
            v-model:value.sync="systemItem.tkcgrNm"
            v-model:isValid.sync="tkcgrNmValid"
            :inputNm="$t('system.tkcgrNm')"
            :place="$t('system.tkcgrNm_placeholder')"
          />
          <InputGroup
            type="text"
            v-model:value.sync="systemItem.tkcgrPos"
            :inputNm="$t('system.tkcgrPos')"
            :place="$t('system.tkcgrPos_placeholder')"
            v-model:isValid.sync="tkcgrPosValid"
          />
          <InputGroup
            type="email"
            v-model:value.sync="systemItem.tkcgrEml"
            :inputNm="$t('system.tkcgrEml')"
            :place="$t('system.tkcgrEml_placeholder', { account: 'example', domain: 'kt.com' })"
            v-model:isValid.sync="tkcgrEmlValid"
          />
          <!-- :place="$t('system.tkcgrEml_placeholder')" -->
          <TextAreaGroup
            :inputNm="$t('system.desc')"
            v-model:value.sync="systemItem.desc"
            v-model:isValid.sync="descValid"
          />
        </ul>
        <ModalLayout size="s" v-if="isShowModal">
          <template v-slot:modalHeader
            ><h1 class="h1-tit">{{ $t('system.modal_system_register') }}</h1>
          </template>
          <template v-slot:modalContainer>
            <p class="text">{{ $t('system.modal_register_message') }}</p>
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
        <button class="lg-btn purple-btn" @click="showModal" :disabled="isBtnDisabled">
          {{ $t('common.register') }}
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
import SystemModule from '@/repository/SystemRepository';
import ContentLayout from '@/components/layout/ContentLayout.vue';
import InputGroup from '@/components/system-mngt/InputGroup.vue';
import TextAreaGroup from '@/components/system-mngt/TextAreaGroup.vue';
import TextDebounceForm from '@/components/system-mngt/TextDebounceForm.vue';
import EdptForm from '@/components/system-mngt/EdptForm.vue';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
import type { SystemRegisterResponse } from '@/types/SystemType';

import { ref, reactive, computed, watch, onMounted, inject } from 'vue';
import type { Ref } from 'vue';

import { BSpinner } from 'bootstrap-vue-3';

import { useRoute, useRouter } from 'vue-router';
import { modalInjectionKey } from '@/plugins/modal/ModalPlugin';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import ErrorCode from '@/error/ErrorCodes';
import type { GateWayError } from '@/error/GateWayError';
const toast = useToast();
const { t } = useI18n({});
const route = useRoute();
const router = useRouter();
const modal = inject(modalInjectionKey)!!;

const idValid = ref(false);
const tkcgrNmValid = ref(false);
const tkcgrPosValid = ref(false);
const tkcgrEmlValid = ref(false);
const edptValid = ref(false);
const descValid = ref(true);
const isShowProgress = ref(false);
const isShowModal = ref(false);
const isBtnDisabled = ref(false);

const systemItem: Ref<SystemRegisterResponse> = ref({
  id: '',
  tkcgrNm: '',
  tkcgrPos: '',
  tkcgrEml: '',
  edpt: ['http::'],
  desc: '',
  cretId: 'ccs',
  updId: 'ccs',
});

const systemModule = new SystemModule();

const cancelOnClickEvent = () => {
  router.go(-1);
};

const timerId = ref(0);
const isDuplicatedId: Ref<boolean | null> = ref(null);

const duplicateCheckId = () => {
  isDuplicatedId.value = null;
  if (timerId.value) {
    clearTimeout(timerId.value);
  }
  timerId.value = setTimeout(async () => {
    await systemModule
      .duplicateCheck(systemItem.value.id)
      .then((res) => {
        isDuplicatedId.value = res;
        console.log('isDuplicatedId.value', isDuplicatedId.value);
      })
      .catch((error: GateWayError) => {
        if (error.getErrorCode() == ErrorCode.CANCEL_ERROR) {
          console.log('SYSTEM API Cancel');
        } else {
          toast.error(t('error.duplicate_check_error'));
        }
      });
  }, 1000);
};

const showModal = () => {
  const val = idValid.value && isDuplicatedId.value && edptValid.value ? true : false;
  // console.log('idValid: ', idValid.value);
  // console.log('tkcgrNmValid: ', tkcgrNmValid.value);
  // console.log('tkcgrPosValid: ', tkcgrPosValid.value);
  // console.log('tkcgrEmlValid: ', tkcgrEmlValid.value);
  // console.log('edptValid: ', edptValid.value);
  // console.log('val: ', val);
  // console.log('systemItem.value: ', systemItem.value);
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
  await systemModule
    .registerSystem(systemItem.value)
    .then(() => {
      isShowProgress.value = false;
      toast.success(t('system.register_success'));
      router.push({ name: 'system' });
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
</script>

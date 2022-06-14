<template>
  <ContentLayout
    :title="$t('system.add_top_title')"
    :subTitle="$t('system.add_cont_title')"
    :depth="$t('system.add_depth')"
  >
    <template v-slot:contents>
      <ul>
        <TextDebounceForm
          type="text"
          :check="isDuplicatedId"
          v-model="systemItem.id"
          v-model:isValid.sync="idValid"
          :inputNm="$t('system.id')"
          :placeholder="$t('system.id_placeholder')"
          :required="true"
          @input="duplicateCheckId"
        />

        <EdptForm :inputNm="$t('system.edpt')" :strArr.sync="systemItem.edpt" :isValid.sync="edptValid" />

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
          :place="$t('system.tkcgrEml_placeholder')"
          v-model:isValid.sync="tkcgrEmlValid"
        />
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
import SystemModule from '@/repository/system-repository';
import ContentLayout from '@/components/system-mngt/ContentLayout.vue';
import InputGroup from '@/components/system-mngt/InputGroup.vue';
import TextAreaGroup from '@/components/system-mngt/TextAreaGroup.vue';
import TextDebounceForm from '@/components/system-mngt/TextDebounceForm.vue';
import EdptForm from '@/components/system-mngt/EdptForm.vue';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
import type { SystemRegisterResponse } from '@/types/SystemType';

import { ref, reactive, computed, watch, onMounted } from 'vue';
import type { Ref } from 'vue';

import { BSpinner } from 'bootstrap-vue-3';

import { useRoute } from 'vue-router';
import router from '@/router';
const route = useRoute();

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
    isDuplicatedId.value = await systemModule.duplicateCheck(systemItem.value.id);
  }, 1000);
};

const showModal = () => {
  const val =
    idValid.value &&
    tkcgrNmValid.value &&
    tkcgrPosValid.value &&
    tkcgrEmlValid.value &&
    edptValid.value &&
    descValid.value
      ? true
      : false;

  if (!val) {
    //   this.$modal.show(`${this.$t('system.empty_check_message')}`);
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
      router.push({ name: 'system' });
    })
    .catch(() => {
      isShowProgress.value = false;
      //   this.$modal.show(`${this.$t('error.server_error')}`);
    });
};
</script>

<style scoped></style>

<template>
  <li>
    <label for="" class="label point">{{ inputNm }}</label>
    <div class="form-cont">
      <div class="domain-wrap">
        <ul class="domain-list">
          <li v-for="(edpt, idx) in edpts" :key="idx">
            <div class="domain-cont">
              <select class="select-box" v-model="edpt.protocol" @change="validCheckProtocol(idx)">
                <option value="http" selected>http</option>
                <option value="https">https</option>
              </select>
              <span>://</span>

              <input
                type="text"
                :class="{
                  'check-ok': notiMessageDomain[idx][0] === true,
                  'check-false': notiMessageDomain[idx][0] === false,
                }"
                class="input-box mid"
                placeholder="domain"
                v-model="edpt.domain"
                @input="validCheckDomain(idx)"
                @focus="emptyChkFunc(idx)"
              />
              <span>:</span>
              <input
                type="text"
                :class="{
                  'check-ok': notiMessagePort[idx][0] === true,
                  'check-false': notiMessagePort[idx][0] === false,
                }"
                class="input-box sm"
                placeholder="port"
                v-model="edpt.port"
                maxlength="5"
                @input="validCheckPort(idx)"
                @focus="emptyChkFunc(idx)"
              />
              <button class="xs-btn" @click="addEdpt" v-if="idx === 0">
                <i class="plus"></i>
              </button>
              <button class="xs-btn" @click="deleteEdpt(idx)" v-else><i class="minus"></i></button>
            </div>
            <p v-if="notiMessageDomain[idx][0] == false" class="red-txt noti">{{ notiMessageDomain[idx][1] }}</p>
            <p v-if="notiMessagePort[idx][0] == false" class="red-txt noti">{{ notiMessagePort[idx][1] }}</p>
            <p v-if="notiMessageDupl[idx][0] == false" class="red-txt noti">{{ notiMessageDupl[idx][1] }}</p>
          </li>
        </ul>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { SystemEdptType } from '@/types/SystemType';
import { edptArrToStringArr, edptToString, stringToEdpt } from '@/utils/converter';
import { checkLength, checkDomain, checkNumber, checkEmpty } from '@/utils/validation';

import { ref, reactive, computed, watch, onMounted } from 'vue';
import type { PropType } from 'vue';
import type { Ref } from 'vue';

import { BSpinner } from 'bootstrap-vue-3';

import { useRoute } from 'vue-router';
import router from '@/router';

import { useI18n } from 'vue-i18n';
const { t } = useI18n({});

const props = defineProps({
  inputNm: { type: String, required: false, default: '' },
  strArr: { type: [] as PropType<String[]>, required: false, default: [] },
  isValid: { type: Boolean || null, required: false, default: false },
  editPage: { type: Boolean, required: false, default: false },
});

const emit = defineEmits<{
  (e: 'update:isValid', value: boolean): void;
  (e: 'update:strArr', value: string[]): void;
}>();

const edpts: Ref<SystemEdptType[]> = ref([]);
const notiMessageDomain: Ref<[boolean | null, string][]> = ref([]);
const notiMessagePort: Ref<[boolean | null, string][]> = ref([]);
const notiMessageDupl: Ref<[boolean | null, string][]> = ref([]);
const isDomainEmpty = ref(true);

onMounted(() => {
  props.strArr.forEach((str) => {
    edpts.value.push(stringToEdpt(str as string));
    notiMessageDomain.value.push([null, '']);
    notiMessagePort.value.push([null, '']);
    notiMessageDupl.value.push([null, '']);
  });
  console.log(props.editPage);
  if (props.editPage) {
    edpts.value.forEach((edpt, idx) => {
      validCheckDomain(idx);
      validCheckPort(idx);
    });
  }
});

watch(edpts, () => {
  // 중복 검사를 수행한다.
  let idxArr: number[] = [];
  edpts.value.forEach((edpt, idx) => {
    if (!duplCheck(edptToString(edpts.value[idx]))) {
      notiMessageDupl.value[idx][0] = true;
      notiMessageDupl.value[idx][1] = '';
      // Vue.set(this.notiMessageDupl[idx], 0, true);
      // Vue.set(this.notiMessageDupl[idx], 1, '');
    } else {
      idxArr.push(idx);
    }
  });

  // 중복된 값이 하나라도 있으면,
  // 마지막에 입력한 엔드포인트에 경고문구를 출력한다.
  if (idxArr.length > 1) {
    if (edpts.value[0].domain !== '' && edpts.value[0].port !== '') {
      notiMessageDupl.value[idxArr[idxArr.length - 1]][0] = false;
      notiMessageDupl.value[idxArr[idxArr.length - 1]][1] = t('system.dupl_check_edpt_nm') as string;
      // Vue.set(this.notiMessageDupl[idxArr[idxArr.length - 1]], 0, false);
      // Vue.set(this.notiMessageDupl[idxArr[idxArr.length - 1]], 1, this.$t('system.dupl_check_edpt_nm') as string);
    }
  }
  // 모든 값이 유효성 check를 통과했다면, isValid를 true로 변경한다.
  // * isValid? => SystemRegister/SystemEdit 페이지에서 태그들의 유효성 검사를 위해 사용한다.
  let valid: boolean | null = true;
  notiMessageDomain.value.forEach((domain) => {
    valid = valid && domain[0];
  });
  notiMessagePort.value.forEach((port) => {
    valid = valid && port[0];
  });
  console.log(valid);
  emit('update:isValid', valid);
  emit('update:strArr', edptArrToStringArr(edpts.value));
});

const addEdpt = () => {
  if (edpts.value.length > 9) {
    return;
  }
  console.log(edpts.value);
  let empty = {
    protocol: 'http',
    domain: '',
    port: '',
  };
  edpts.value.push(empty);
  notiMessagePort.value.push([null, '']);
  notiMessageDomain.value.push([null, '']);
  notiMessageDupl.value.push([null, '']);
};

const deleteEdpt = (idx: number) => {
  edpts.value.splice(idx, 1);
  notiMessageDomain.value.splice(idx, 1);
  notiMessagePort.value.splice(idx, 1);
  notiMessageDupl.value.splice(idx, 1);
};

const duplCheck = (val: string) => {
  let duplCnt = 0;
  let duplArr = edptArrToStringArr(edpts.value);
  for (let i = 0; i < duplArr.length; i++) {
    if (val === duplArr[i]) {
      duplCnt++;
    }
  }
  if (duplCnt > 1) {
    return true;
  }
  return false;
};
const emptyChkFunc = (idx: number) => {
  if (!checkEmpty(edpts.value[idx].domain)) {
    notiMessageDomain.value[idx][0] = false;
    notiMessageDomain.value[idx][1] = t('system.empty_check_edpt_domain') as string;
    // Vue.set(this.notiMessageDomain[idx], 0, false);
    // Vue.set(this.notiMessageDomain[idx], 1, this.$t('system.empty_check_edpt_domain') as string);
  }
  if (!checkEmpty(edpts.value[idx].port)) {
    notiMessageDomain.value[idx][0] = false;
    notiMessageDomain.value[idx][1] = t('system.empty_check_edpt_port') as string;
    // Vue.set(this.notiMessagePort[idx], 0, false);
    // Vue.set(this.notiMessagePort[idx], 1, this.$t('system.empty_check_edpt_port') as string);
  }
};
const validCheckProtocol = (idx: number) => {
  console.log('selectChanged!!!');
  if (!duplCheck(edptToString(edpts.value[idx]))) {
    notiMessageDomain.value[idx][0] = true;
    notiMessageDomain.value[idx][1] = '';
    // Vue.set(this.notiMessageDomain[idx], 0, true);
    // Vue.set(this.notiMessageDomain[idx], 1, '');
  } else {
    notiMessageDomain.value[idx][0] = false;
    notiMessageDomain.value[idx][1] = t('system.dupl_check_edpt_nm') as string;
    // Vue.set(this.notiMessageDomain[idx], 0, false);
    // Vue.set(this.notiMessageDomain[idx], 1, this.$t('system.dupl_check_edpt_nm') as string);
  }
};

const validCheckDomain = (idx: number) => {
  console.log('domainQ!!!');
  let domain = edpts.value[idx].domain;
  if (checkLength(domain, 1, 30) && checkDomain(domain)) {
    // 중복 체크 수행
    // edpt 구조로 저장되어있던 값들을 String 값으로 변환한다.
    notiMessageDomain.value[idx][0] = true;
    notiMessageDomain.value[idx][1] = '';
    // Vue.set(this.notiMessageDomain[idx], 0, true);
    // Vue.set(this.notiMessageDomain[idx], 1, '');
  } else if (domain == '') {
    notiMessageDomain.value[idx][0] = false;
    notiMessageDomain.value[idx][1] = t('system.empty_check_edpt_domain') as string;
    // Vue.set(this.notiMessageDomain[idx], 0, false);
    // Vue.set(this.notiMessageDomain[idx], 1, this.$t('system.empty_check_edpt_domain') as string);
  } else {
    notiMessageDomain.value[idx][0] = false;
    notiMessageDomain.value[idx][1] = t('system.valid_check_edpt_domain') as string;
    // Vue.set(this.notiMessageDomain[idx], 0, false);
    // Vue.set(this.notiMessageDomain[idx], 1, this.$t('system.valid_check_edpt_domain') as string);
  }
};

const validCheckPort = (idx: number) => {
  let port = edpts.value[idx].port;
  if (checkLength(port, 1, 30) && checkNumber(port)) {
    // 중복 체크 수행
    // edpt 구조로 저장되어있던 값들을 String 값으로 변환한다.
    notiMessagePort.value[idx][0] = true;
    notiMessagePort.value[idx][1] = '';

    // Vue.set(this.notiMessagePort[idx], 0, true);
    // Vue.set(this.notiMessagePort[idx], 1, '');
  } else if (port == '') {
    notiMessagePort.value[idx][0] = false;
    notiMessagePort.value[idx][1] = t('system.empty_check_edpt_port') as string;
    // Vue.set(this.notiMessagePort[idx], 0, false);
    // Vue.set(this.notiMessagePort[idx], 1, this.$t('system.empty_check_edpt_port') as string);
  } else {
    notiMessagePort.value[idx][0] = false;
    notiMessagePort.value[idx][1] = t('system.valid_check_edpt_port') as string;
    // Vue.set(this.notiMessagePort[idx], 0, false);
    // Vue.set(this.notiMessagePort[idx], 1, this.$t('system.valid_check_edpt_port') as string);
  }
};
</script>

<style scoped></style>

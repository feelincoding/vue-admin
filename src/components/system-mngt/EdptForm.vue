<template>
  <li>
    <label for="" class="label point">{{ inputNm }} : </label>
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
                  'check-ok': notiMessageDomain[idx].isValid === true,
                  'check-false': notiMessageDomain[idx].isValid === false,
                }"
                class="input-box mid"
                placeholder="domain"
                v-model="edpt.domain"
                @input="validCheckDomain(idx)"
                @focusin="focusInDomain(idx)"
              />
              <!-- @focus="emptyChkFunc(idx)"  -->
              <span>:</span>
              <input
                type="text"
                :class="{
                  'check-ok': notiMessagePort[idx].isValid === true,
                  'check-false': notiMessagePort[idx].isValid === false,
                }"
                class="input-box sm"
                placeholder="port"
                v-model="edpt.port"
                maxlength="5"
                @input="validCheckPort(idx)"
                @focusin="focusInPort(idx)"
              />
              <button class="xs-btn" @click="addEdpt" v-if="idx === 0">
                <i class="plus"></i>
              </button>
              <button class="xs-btn" @click="deleteEdpt(idx)" v-else><i class="minus"></i></button>
            </div>
            <!-- <p class="gray-txt">- 도메인 양식 준수 및 port번호 5자리</p> -->
            <p v-if="notiMessageDomain[idx].isValid === false" class="noti">
              {{ notiMessageDomain[idx].message }}
            </p>
            <p v-if="notiMessagePort[idx].isValid === false" class="red-txt noti">{{ notiMessagePort[idx].message }}</p>
            <p v-if="notiMessageDupl[idx].isValid === false" class="red-txt noti">{{ notiMessageDupl[idx].message }}</p>
            <!-- <p v-if="notiMessageDomain[idx].isValid === false" class="red-txt noti">
              {{ notiMessageDomain[idx].message }}
            </p>
            <p v-if="notiMessagePort[idx].isValid === false" class="red-txt noti">{{ notiMessagePort[idx].message }}</p>
            <p v-if="notiMessageDupl[idx].isValid === false" class="red-txt noti">{{ notiMessageDupl[idx].message }}</p> -->
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

import type { ValidationCheckType } from './SystemMngtType';

import { ref, watch, onMounted } from 'vue';
import type { PropType } from 'vue';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({});

const props = defineProps({
  inputNm: { type: String, required: false, default: '' },
  strArr: { type: Array<String>, required: false, default: ['http::'] },
  isValid: { type: Boolean || null, required: false, default: false },
  editPage: { type: Boolean, required: false, default: false },
});
const emit = defineEmits<{
  (e: 'update:isValid', value: boolean): void;
  (e: 'update:strArr', value: string[]): void;
}>();

const edpts: Ref<SystemEdptType[]> = ref([]);
const notiMessageDomain: Ref<ValidationCheckType[]> = ref([]);
const notiMessagePort: Ref<ValidationCheckType[]> = ref([]);
const notiMessageDupl: Ref<ValidationCheckType[]> = ref([]);

// const isDomainEmpty = ref(true);

onMounted(() => {
  // console.log('@@@:', props);
  props.strArr.forEach((str) => {
    edpts.value.push(stringToEdpt(str as string));
    notiMessageDomain.value.push({
      isValid: null,
      message: '',
    });
    notiMessagePort.value.push({
      isValid: null,
      message: '',
    });
    notiMessageDupl.value.push({
      isValid: null,
      message: '',
    });
  });
  if (props.editPage) {
    edpts.value.forEach((edpt, idx) => {
      validCheckDomain(idx);
      validCheckPort(idx);
    });
  }
});

watch(edpts.value, () => {
  console.log('watch edpts!!');

  let idxArr: number[] = [];
  // 중복 검사를 수행한다.(도메인, 포트가 둘 중 하나라도 입력일 때만)
  edpts.value.forEach((edpt, idx) => {
    console.log("edpt:", edpt);
    if (!(edpt.domain === '' && edpt.port === '')) {
      if (!duplCheck(edptToString(edpts.value[idx]))) {
        notiMessageDupl.value[idx].isValid = true;
        notiMessageDupl.value[idx].message = '';
      } else {
        idxArr.push(idx);
      }
    }
  });

  // 중복된 값이 하나라도 있으면,
  // 마지막에 입력한 엔드포인트에 경고문구를 출력한다.
  if (idxArr.length > 1) {
    if (edpts.value[0].domain !== '' && edpts.value[0].port !== '') {
      notiMessageDupl.value[idxArr[idxArr.length - 1]].isValid = false;
      notiMessageDupl.value[idxArr[idxArr.length - 1]].message = t('system.dupl_check_edpt_nm') as string;
    }
  }

  let valid: boolean | null = true; // | string
  notiMessageDomain.value.forEach((domain, idx) => {
    if(edpts.value[idx].domain === '') {
      valid = valid && false;
    }else {
      valid = valid && domain.isValid;
    }
  });

  notiMessagePort.value.forEach((port, idx) => {
    if(edpts.value[idx].port === '') {
      valid = valid && false;
    }else {
      valid = valid && port.isValid;
    }
  });

  console.log('valid:', valid);

  emit('update:isValid', valid);
  emit('update:strArr', edptArrToStringArr(edpts.value));
});

const focusInDomain = (idx: number) => {
  let domainValue = edpts.value[idx].domain;
  if (domainValue === '') {
    notiMessageDomain.value[idx].isValid = false;
    notiMessageDomain.value[idx].message = t('system.empty_check_edpt_domain');
  }
  // let notiDomCheck = notiMessageDomain.value[idx];
};
// const focusOutDomain = (idx: number) => {
//   console.log('focusOutDomain', idx);
// };

const focusInPort = (idx: number) => {
  let portValue = edpts.value[idx].port;
  // 입력할려고 클릭했을 때 빈 값이면 필수 값이라는 메시지를 띄워준다.
  if (portValue === '') {
    notiMessagePort.value[idx].isValid = false;
    notiMessagePort.value[idx].message = t('system.empty_check_edpt_port');
  }
};
// const focusOutPort = (idx: number) => {
//   console.log('focusInPort', idx);
// };

const addEdpt = () => {
  if (edpts.value.length > 9) {
    return;
  }
  let empty = {
    protocol: 'http',
    domain: '',
    port: '',
  };
  edpts.value.push(empty);
  notiMessagePort.value.push({
    isValid: null,
    message: '',
  });
  notiMessageDomain.value.push({
    isValid: null,
    message: '',
  });
  notiMessageDupl.value.push({
    isValid: null,
    message: '',
  });
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

// 빈칸 체크: 도메인. 포트 각각의 값이 빈칸이면 false, 경고문구를 출력한다.
// const emptyChkFunc = (idx: number) => {
//   console.log('emptyChkFunc idx: ', idx);
//   if (!checkEmpty(edpts.value[idx].domain)) {
//     notiMessageDomain.value[idx].isValid = false;
//     notiMessageDomain.value[idx].message = t('system.empty_check_edpt_domain') as string;
//   }
//   if (!checkEmpty(edpts.value[idx].port)) {
//     notiMessageDomain.value[idx].isValid = false;
//     notiMessageDomain.value[idx].message = t('system.empty_check_edpt_port') as string;
//   }
// };

const validCheckProtocol = (idx: number) => {
  if (notiMessageDomain.value[idx].isValid === true && notiMessagePort.value[idx].isValid === true) {
    // domain, port 규격 통과시에는 프로토콜 검사를 한다.
    if (!duplCheck(edptToString(edpts.value[idx]))) {
      notiMessageDupl.value[idx].isValid = true;
      notiMessageDupl.value[idx].message = '';
    } else {
      notiMessageDupl.value[idx].isValid = false;
      notiMessageDupl.value[idx].message = t('system.dupl_check_edpt_nm') as string;
    }
  }
};

const validCheckDomain = (idx: number) => {
  console.log('validCheckDomain idx: ', idx);
  let domain = edpts.value[idx].domain;
  if (checkLength(domain, 1, 30) && checkDomain(domain)) {
    // 중복 체크 수행
    // edpt 구조로 저장되어있던 값들을 String 값으로 변환한다.
    notiMessageDomain.value[idx].isValid = true;
    notiMessageDomain.value[idx].message = '';
  } else if (domain == '') {
    notiMessageDomain.value[idx].isValid = false;
    notiMessageDomain.value[idx].message = t('system.empty_check_edpt_domain') as string;
  } else {
    notiMessageDomain.value[idx].isValid = false;
    notiMessageDomain.value[idx].message = t('system.valid_check_edpt_domain') as string;
  }
};

const validCheckPort = (idx: number) => {
  let port = edpts.value[idx].port;
  if (checkLength(port, 1, 30) && checkNumber(port)) {
    // 중복 체크 수행
    // edpt 구조로 저장되어있던 값들을 String 값으로 변환한다.
    notiMessagePort.value[idx].isValid = true;
    notiMessagePort.value[idx].message = '';
  } else if (port == '') {
    console.log("port 빈값")
    notiMessagePort.value[idx].isValid = false;
    notiMessagePort.value[idx].message = t('system.empty_check_edpt_port') as string;
  } else {
    notiMessagePort.value[idx].isValid = false;
    notiMessagePort.value[idx].message = t('system.valid_check_edpt_port') as string;
  }
};
</script>

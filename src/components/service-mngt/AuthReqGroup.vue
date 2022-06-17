<template>
  <li>
    <label class="label point">{{ inputNm }} :</label>
    <div class="form-cont">
      <div class="form-group">
        <select class="select-box lg" v-model="auth">
          <option value="basic">Basic Auth</option>
          <option value="jwt">JWT</option>
        </select>
      </div>

      <div v-if="auth == 'basic'" class="auth-group">
        <!-- Basic Auth -->
        <ul class="domain-list lg">
          <li>
            <div class="auth-form">
              <label class="label">ID :</label>
              <input type="text" id="" class="input-box" placeholder="자동생성/변경불가" disabled v-model="basicId" />
              <button @click="clicked" class="xs-btn">
                <i v-show="!progress" class="serve"></i>
                <b-spinner v-show="progress" small></b-spinner>
              </button>
            </div>
          </li>
          <li>
            <div class="auth-form">
              <label class="label">PW :</label>
              <input type="text" id="" class="input-box" placeholder="자동생성/변경불가" disabled v-model="basicPw" />
            </div>
          </li>
        </ul>
      </div>
      <!-- // Basic Auth -->
      <!-- JWT -->
      <div v-if="auth == 'jwt'" class="auth-group">
        <ul class="domain-list lg">
          <li>
            <div class="auth-form">
              <label class="label">알고리즘 :</label>
              <select class="select-box" v-model="algPick" @focus="noticeInput()">
                <option disabled value="null">선택해주세요</option>
                <option v-for="item in JWTalg" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>
          </li>
          <li>
            <div class="auth-form">
              <label class="label">발급자 :</label>
              <input type="text" id="" class="input-box" placeholder="" v-model="JWTissuer" @focus="noticeInput()" />
            </div>
          </li>
          <li>
            <div class="auth-form">
              <label class="label">대상자 :</label>
              <input type="text" id="" class="input-box" placeholder="" v-model="JWTsubject" @focus="noticeInput()" />
            </div>
          </li>
          <li>
            <div class="auth-form">
              <label class="label">공개key :</label>
              <textarea class="textarea" v-model="JWTpublicKey" @focus="noticeInput()"></textarea>
            </div>
          </li>
        </ul>
      </div>
      <!-- /JWT -->
      <p
        v-if="
          (showInput && algPick == 'null') ||
          (showInput && JWTissuer == '') ||
          (showInput && JWTsubject == '') ||
          (showInput && JWTpublicKey == '') ||
          (showInput && algPick == null) ||
          (showInput && JWTissuer == null) ||
          (showInput && JWTsubject == null) ||
          (showInput && JWTpublicKey == null) ||
          (auth == 'basic' && basicId == '') ||
          (auth == 'basic' && basicId == null) ||
          !props.isValid
        "
        class="red-txt noti"
      >
        {{ $t('service.empty_check') }}
      </p>
    </div>
  </li>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { BSpinner } from 'bootstrap-vue-3';
const props = defineProps<{
  inputNm: string;
  athn: string;
  alg: string[];
  issuer: string | null;
  subject: string | null;
  publicKey: string | null;
  pickedAlg: string | null;
  basicId: string | null;
  basicPw: string | null;
  isValid: boolean | null;
  progress: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:isValid', value: boolean | null): void;
  (e: 'update:basicId', value: string | null): void;
  (e: 'update:basicPw', value: string | null): void;
  (e: 'update:pickedAlg', value: string | null): void;
  (e: 'update:alg', value: string[]): void;
  (e: 'update:issuer', value: string | null): void;
  (e: 'update:subject', value: string | null): void;
  (e: 'update:publicKey', value: string | null): void;
  (e: 'update:athn', value: string): void;
  (e: 'basicAuthClicked'): void;
}>();

const showInput = ref(false);

watch(
  () => props.basicId,
  (val) => {
    if (auth.value == 'basic') {
      if (val == '' || val == null) {
        emit('update:isValid', false);
      } else {
        emit('update:pickedAlg', null);
        emit('update:issuer', null);
        emit('update:subject', null);
        emit('update:publicKey', null);
        emit('update:isValid', true);
      }
    }
  }
);

const auth = computed({
  get: () => props.athn,
  set: (val) => {
    showInput.value = false;
    emit('update:athn', val);
    emit('update:isValid', false);
  },
});

const JWTalg = computed({
  get: () => props.alg,
  set: (val) => {
    emit('update:alg', val);
  },
});

const algPick = computed({
  get: () => props.pickedAlg,
  set: (val) => {
    emit('update:pickedAlg', val);
    if (auth.value == 'jwt') {
      emit('update:basicId', null);
      emit('update:basicPw', null);
      if (
        algPick.value != 'null' &&
        JWTissuer.value != '' &&
        JWTsubject.value != '' &&
        JWTpublicKey.value != '' &&
        algPick.value != null &&
        JWTissuer.value != null &&
        JWTsubject.value != null &&
        JWTpublicKey.value != null
      ) {
        console.log('update:isValid', true);
        emit('update:isValid', true);
      } else {
        emit('update:isValid', false);
      }
    }
  },
});

const JWTissuer = computed({
  get: () => props.issuer,
  set: (val) => {
    emit('update:issuer', val);
    if (auth.value == 'jwt') {
      emit('update:basicId', null);
      emit('update:basicPw', null);
      if (
        algPick.value != 'null' &&
        JWTissuer.value != '' &&
        JWTsubject.value != '' &&
        JWTpublicKey.value != '' &&
        algPick.value != null &&
        JWTissuer.value != null &&
        JWTsubject.value != null &&
        JWTpublicKey.value != null
      ) {
        console.log('update:isValid', true);
        emit('update:isValid', true);
      } else {
        emit('update:isValid', false);
      }
    }
  },
});

const JWTsubject = computed({
  get: () => props.subject,
  set: (val) => {
    emit('update:subject', val);
    if (auth.value == 'jwt') {
      emit('update:basicId', null);
      emit('update:basicPw', null);
      if (
        algPick.value != 'null' &&
        JWTissuer.value != '' &&
        JWTsubject.value != '' &&
        JWTpublicKey.value != '' &&
        algPick.value != null &&
        JWTissuer.value != null &&
        JWTsubject.value != null &&
        JWTpublicKey.value != null
      ) {
        console.log('update:isValid', true);
        emit('update:isValid', true);
      } else {
        emit('update:isValid', false);
      }
    }
  },
});

const JWTpublicKey = computed({
  get: () => props.publicKey,
  set: (val) => {
    emit('update:publicKey', val);
    if (auth.value == 'jwt') {
      emit('update:basicId', null);
      emit('update:basicPw', null);
      if (
        algPick.value != 'null' &&
        JWTissuer.value != '' &&
        JWTsubject.value != '' &&
        JWTpublicKey.value != '' &&
        algPick.value != null &&
        JWTissuer.value != null &&
        JWTsubject.value != null &&
        JWTpublicKey.value != null
      ) {
        console.log('update:isValid', true);
        emit('update:isValid', true);
      } else {
        emit('update:isValid', false);
      }
    }
  },
});

const clicked = () => {
  emit('basicAuthClicked');
};

const noticeInput = () => {
  showInput.value = true;
};
</script>

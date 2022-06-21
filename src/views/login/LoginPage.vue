<template>
  <article class="body-cont">
    <h1>this is LoginPage!!</h1>
    <vue-recaptcha
      @verify="handleSuccessRecaptcha"
      @expired="handleFailRecaptcha"
      @error="handleFailRecaptcha"
      :sitekey="sitekey"
      language="ko"
    ></vue-recaptcha>
  </article>
</template>

<script setup lang="ts">
import { VueRecaptcha } from 'vue-recaptcha';
import i18n from '@/plugins/Locale';
const sitekey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const handleSuccessRecaptcha = (token: string) => {
  // 리캡차 통과, 로그인 시나리오 진행
  console.log('리캡차 통과\n token : ', token);
};

const handleFailRecaptcha = (error: any) => {
  // 리캡차 실패, 시나리오 정상 진행
  console.log('리캡차 실패 : ', error);
};
</script>

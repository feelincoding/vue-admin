<template>
  <article class="body-cont">
    <h1>this is LoginPage!!</h1>
    <!-- 리캡차 사용 -->
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

//Todo 아래의 recaptcha 키는 개인발급된 키입니다. 변경 필요합니다.
const sitekey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

// 리캡차 통과, 로그인 시나리오 진행
const handleSuccessRecaptcha = (token: string) => {
  console.log('리캡차 통과\n token : ', token);
};

// 리캡차 실패
const handleFailRecaptcha = (error: any) => {
  console.log('리캡차 실패\n', error);
};
</script>

import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from '@/locales/en.json';
import ko from '@/locales/kr.json';

Vue.use(VueI18n);

export default new VueI18n({
  locale: 'ko',
  fallbackLocale: 'ko',
  messages: { en, ko },
});

//////// 사용 법 /////////
// "message": {
//   "example": "example",
//   "hello": "example { name }"
// }
//
// 1. 일반(example)
// templete : {{ $t("message.example") }}
// script : this.$t('message.example')
// 2. 문자열(hello)
// templete :{{ $t('message.hello', { name: '펭수' }) }}
// script : this.$t('message.hello', { name: '펭수' }),

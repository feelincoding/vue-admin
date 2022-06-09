<template>
  <li>
    <label
      for=""
      :class="{
        'label point': required === true,
        label: required === false,
      }"
      >{{ inputNm }}</label
    >
    <div class="form-cont">
      <input
        :type="type"
        :class="{
          'check-ok': notiMessage[0] === true,
          'check-false': notiMessage[0] === false,
        }"
        class="input-box lg"
        :placeholder="place"
        :disabled="disabled"
        v-model="v"
        @focus="emptyChkFunc"
      />
      <p v-if="notiMessage[0] == false" class="red-txt noti">{{ notiMessage[1] }}</p>
    </div>
  </li>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import {
  checkEmail,
  checkLength,
  checkEnglishNumber,
  checkEnglishKorean,
  checkEmpty,
  checkEnglishNumberKorean,
} from '@/utils/validation';

@Component
export default class InputGroup extends Vue {
  @Prop({ default: '' }) inputNm!: string;
  @Prop({ default: '' }) type!: string;
  @Prop({ default: '' }) place!: string;
  @Prop({ default: false }) disabled!: boolean;
  @Prop({ default: '' }) value!: string;
  @Prop({ default: false }) isValid!: boolean | null;
  @Prop({ default: false }) required!: boolean;

  notiMessage: [boolean | null, string] = [null, ''];

  @Watch('notiMessage', { deep: true })
  messageChanged() {
    this.$emit('update:isValid', this.notiMessage[0]);
  }

  created() {
    if (this.required === false) {
      this.$emit('update:isValid', true);
    }
  }

  get v() {
    return this.value;
  }
  set v(val: string) {
    switch (this.inputNm) {
      case this.$t('system.id'):
        if (checkLength(val, 1, 20) && checkEnglishNumber(val)) {
          this.notiMessage = [true, ''];
        } else if (val == '') {
          this.notiMessage = [false, this.$t('system.empty_check') as string];
        } else {
          this.notiMessage = [false, this.$t('system.valid_check_id') as string];
          console.log(this.notiMessage);
        }
        break;
      case this.$t('system.tkcgrNm'):
        if (checkLength(val, 1, 20) && checkEnglishKorean(val)) {
          this.notiMessage = [true, ''];
        } else if (val == '') {
          this.notiMessage = [true, ''];
        } else {
          this.notiMessage = [false, this.$t('system.valid_check_tkcgrNm') as string];
        }
        break;
      case this.$t('system.tkcgrPos'):
        if (checkLength(val, 1, 50)) {
          this.notiMessage = [true, ''];
        } else if (val == '') {
          this.notiMessage = [true, ''];
        } else {
          this.notiMessage = [false, this.$t('system.valid_check_tkcgrPos') as string];
        }
        break;
      case this.$t('system.tkcgrEml'):
        if (checkLength(val, 1, 20) && checkEmail(val)) {
          this.notiMessage = [true, ''];
        } else if (val == '') {
          this.notiMessage = [true, ''];
        } else {
          this.notiMessage = [false, this.$t('system.valid_check_tkcgrEml') as string];
        }
        break;
      default:
        this.notiMessage = [null, ''];
    }

    this.$emit('update:value', val);
  }

  emptyChkFunc() {
    if (this.required === true && !checkEmpty(this.v)) {
      this.notiMessage = [false, this.$t('system.empty_check') as string];
    }
  }
}
</script>
<style lang=""></style>

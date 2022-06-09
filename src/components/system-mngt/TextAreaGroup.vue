<template>
  <li>
    <label for="" class="label">{{ inputNm }}</label>
    <div class="form-cont">
      <textarea class="textarea" v-model="v"></textarea>
      <p v-if="notiMessage[0] == false" class="red-txt noti">{{ notiMessage[1] }}</p>
    </div>
  </li>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { checkLength } from '@/utils/validation';
@Component
export default class TextAreaGroup extends Vue {
  @Prop({ default: '' }) inputNm!: string;
  @Prop({ default: '' }) value!: string;
  @Prop({ default: true }) isValid!: boolean | null;
  notiMessage: [boolean | null, string] = [null, ''];

  get v() {
    return this.value;
  }
  set v(val: string) {
    let valid = true;
    if (checkLength(val, 0, 1000)) {
      this.notiMessage = [true, ''];
      valid = true;
    } else {
      this.notiMessage = [false, this.$t('system.desc_length_check') as string];
      valid = false;
    }
    this.$emit('update:value', val);
    this.$emit('update:isValid', valid);
  }
}
</script>
<style lang=""></style>

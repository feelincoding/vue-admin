<template lang="">
  <li>
    <label class="label">{{ inputNm }}</label>
    <div class="form-cont">
      <p>{{ value }}</p>
    </div>
  </li>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class InfoGroup extends Vue {
  @Prop() public inputNm!: string | null;
  @Prop() public value!: string | number | null;
}
</script>

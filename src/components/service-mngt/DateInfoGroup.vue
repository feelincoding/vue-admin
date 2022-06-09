<template lang="">
  <li>
    <label class="label">{{ inputNm }}</label>
    <div class="form-cont">
      <p>{{ startDt }} ~ {{ endDt }}</p>
    </div>
  </li>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DateInfoGroup extends Vue {
  @Prop() public inputNm!: string | null;
  @Prop() public startDt!: string | number | null;
  @Prop() public endDt!: string | number | null;
}
</script>

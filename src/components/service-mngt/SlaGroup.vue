<template>
  <li>
    <label class="label">{{ inputNm }}</label>
    <div class="form-cont">
      <div class="sla-group col-2">
        <div v-if="monthVal != null" class="sla-form">
          <span class="bold">Month : </span><span>{{ monthVal }}</span
          ><span>건</span>
        </div>
        <div v-if="dayVal != null" class="sla-form">
          <span class="bold">Day : </span><span>{{ dayVal }}</span
          ><span>건</span>
        </div>
        <div v-if="hourVal != null" class="sla-form">
          <span class="bold">Hour : </span><span>{{ hourVal }}</span
          ><span>건</span>
        </div>
        <div v-if="minVal != null" class="sla-form">
          <span class="bold">Min : </span><span>{{ minVal }}</span
          ><span>건</span>
        </div>
        <div v-if="secVal != null" class="sla-form">
          <span class="bold">Sec : </span><span>{{ secVal }}</span
          ><span>건</span>
        </div>
      </div>
    </div>
  </li>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SlaGroup extends Vue {
  @Prop() public inputNm!: string | null;
  @Prop({ default: null }) secVal!: number | null;
  @Prop({ default: null }) minVal!: number | null;
  @Prop({ default: null }) hourVal!: number | null;
  @Prop({ default: null }) dayVal!: number | null;
  @Prop({ default: null }) monthVal!: number | null;
}
</script>

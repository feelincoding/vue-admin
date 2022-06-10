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
<script setup lang="ts">
defineProps<{
  inputNm: string;
  secVal?: number | null;
  minVal?: number | null;
  hourVal?: number | null;
  dayVal?: number | null;
  monthVal?: number | null;
}>();
</script>

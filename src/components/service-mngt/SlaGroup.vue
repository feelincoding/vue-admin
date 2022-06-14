<template>
  <li>
    <label class="label">{{ inputNm }} :</label>
    <div class="form-cont">
      <div class="sla-group">
        <div class="sla-block" v-if="monthVal != null">
          <label class="label">Month : </label>
          <span class="black-txt"
            ><em class="bold">{{ monthVal }}</em
            >건</span
          >
        </div>
        <div class="sla-block" v-if="dayVal != null">
          <label class="label">Day : </label>
          <span class="black-txt"
            ><em class="bold">{{ dayVal }}</em
            >건</span
          >
        </div>
        <div class="sla-block" v-if="hourVal != null">
          <label class="label">Hour : </label>
          <span class="black-txt"
            ><em class="bold">{{ hourVal }}</em
            >건</span
          >
        </div>
        <div class="sla-block" v-if="minVal != null">
          <label class="label">Min : </label>
          <span class="black-txt"
            ><em class="bold">{{ minVal }}</em
            >건</span
          >
        </div>
        <div class="sla-block" v-if="secVal != null">
          <label class="label">sec : </label>
          <span class="black-txt"
            ><em class="bold">{{ secVal }}</em
            >건</span
          >
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

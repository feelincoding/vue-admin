<template>
  <li>
    <label class="label">{{ inputNm }} : </label>
    <div class="form-cont">
      <div class="sub-group">
        <ul>
          <li v-for="(endPoint, index) in endPoints" :key="index">
            <p class="black-txt">{{ endPoint }}</p>
          </li>
        </ul>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
const props = defineProps<{
  inputNm: string | null;
  endPoints?: string[] | null;
}>();
</script>

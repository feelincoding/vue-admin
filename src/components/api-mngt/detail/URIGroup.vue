<template lang="">
  <li>
    <label class="label">{{ props.inputNm }}</label>
    <div class="form-cont">
      <div class="form-group">
        <img class="img" src="@/assets/in.svg" alt="uri" />
        <span>{{ props.uriSer }}</span>
      </div>
      <div class="form-group">
        <img class="img" src="@/assets/out.svg" alt="uri" />
        <span>{{ props.uriSys }}</span>
      </div>
    </div>
  </li>
</template>
<script setup lang="ts">
const props = defineProps<{
  inputNm: string;
  uriSer: string;
  uriSys: string;
}>();
</script>

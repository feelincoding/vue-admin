<template>
  <div class="error-wrapper">
    <div class="error-wrapper-background"></div>
    <img class="img" id="error-wrapper-icon" src="@/assets/warning_ico.svg" alt="uri" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop, PropSync } from 'vue-property-decorator';
@Component
export default class ErrorWrapper extends Vue {
  @PropSync('modal', { type: Boolean, default: false }) syncedModal!: boolean;
  @PropSync('isDraged', { type: Number }) syncedIsDraged!: number;
}
</script>
<style scoped>
.error-wrapper {
  z-index: 100;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.error-wrapper-background {
  background: #c0c0c0;
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.8;
  border-radius: 5px;
}
#error-wrapper-icon {
  width: 100%;
  height: 100%;
  transform: scale(0.8);
}
</style>

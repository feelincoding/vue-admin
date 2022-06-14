<template>
  <div>
    <transition name="HoverModal">
      <!------- handler pop2 -------->
      <div class="tip-box">
        {{ apiDesc }}
        <!-- <h1>api Desc</h1> -->
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  apiDesc: string;
}>();
</script>
<style scoped>
/***   pop2up   ***/
/* .tip-box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  padding: 15px 15px;
  max-width: 200px;
  max-height: 100px;
  z-index: 5;
  background: #777777;
  border-radius: 8px;
  color: #ffffff;
} */
</style>

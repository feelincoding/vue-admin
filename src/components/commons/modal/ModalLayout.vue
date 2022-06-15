<template>
  <transition v-if="!alert" name="modal" appear>
    <div class="modal-overlay">
      <!------- handler pop -------->
      <div :class="{ large: l, 'mid-pop': m, 'sm-pop': s, 'lg-pop': lg, 'pop-wrap': true }">
        <div class="pop-header">
          <slot name="modalHeader"></slot>
        </div>
        <div class="pop-container" :class="{ 'overflow-y': overflowY }">
          <slot name="modalContainer"></slot>
        </div>
        <div class="pop-footer">
          <slot name="modalFooter"></slot>
        </div>
      </div>
    </div>

    <!------- handler pop -------->
  </transition>

  <transition v-else name="alertLayout" appear>
    <div class="modal-overlay">
      <!------- handler pop -------->
      <div :class="{ large: l, 'mid-pop': m, 'sm-pop': s, 'lg-pop': lg, 'pop-wrap': true }">
        <div class="pop-header">
          <slot name="modalHeader"></slot>
          <h1 class="h1-tit">{{ errorTitle }}</h1>
          <button @click="$emit('close')">
            <i><img src="@/assets/close.svg" alt="닫기" title="닫기" /></i>
          </button>
        </div>
        <div class="pop-container">
          <slot name="modalContainer"></slot>
          <p class="text">{{ errorDesc }}</p>
        </div>
        <div class="pop-footer">
          <slot name="modalFooter"></slot>
          <button class="lg-btn purple-btn" @click="$emit('close')">ok</button>
        </div>
      </div>
    </div>
    <!------- handler pop -------->
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { disableScrolling, enableScrolling } from '@/utils/screen';

const props = defineProps<{
  alert?: boolean;
  errorTitle?: string;
  errorDesc?: string;
  size?: string;
  overflowY?: boolean;
}>();

const l = ref(false);
const m = ref(false);
const s = ref(false);
const lg = ref(false);
onMounted(() => {
  disableScrolling();
  if (props.size == 'l') {
    l.value = true;
    m.value = false;
    s.value = false;
    lg.value = false;
  } else if (props.size == 'm') {
    l.value = false;
    m.value = true;
    s.value = false;
    lg.value = false;
  } else if (props.size == 's') {
    l.value = false;
    m.value = false;
    s.value = true;
    lg.value = false;
  } else if (props.size == 'lg') {
    l.value = false;
    m.value = false;
    s.value = false;
    lg.value = true;
  }
});

onUnmounted(() => {
  enableScrolling();
});
</script>

<style scoped>
.large {
}

.modal-enter,
.modal-leave-to,
.alertLayout-enter,
.alertLayout-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
.modal-enter-active,
.modal-leave-active,
.alertLayout-enter-active,
.alertLayout-leave-active {
  transition: opacity 0.3s;
}

.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
</style>

<template>
  <li>
    <label class="label">{{ inputNm }} :</label>
    <div class="form-cont">
      <div class="form-group">
        <p class="api-more">
          <span class="bold">{{ countApiList }}</span
          >건
        </p>
        <button class="more-btn" @click="ShowApiAuth">
          <i><img src="@/assets/more_ico.svg" alt="더보기" /></i>
        </button>
      </div>
    </div>
  </li>
</template>
<script setup lang="ts">
defineProps<{
  inputNm?: string;
  countApiList?: number;
}>();
const emit = defineEmits<{
  (e: 'setShowApiAuth'): void;
}>();
const ShowApiAuth = () => {
  emit('setShowApiAuth');
};
</script>

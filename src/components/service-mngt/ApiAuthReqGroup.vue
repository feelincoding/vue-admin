<template>
  <li>
    <label class="label point">{{ $t('service.api_mngt') }} :</label>
    <div class="form-cont">
      <button class="sm-btn" @click="showApiAuth">{{ inputNm }}</button>
      <p v-if="!check" class="red-txt noti">{{ $t('service.valid_check_api') }}</p>
    </div>
  </li>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  inputNm: { type: String, require: false, default: '' },
  setCheck: { type: Boolean, require: false, default: true },
});

const emit = defineEmits<{
  (e: 'showApiAuth'): void;
}>();

const showApiAuth = () => {
  emit('showApiAuth');
};

const check = ref(true);

watch(
  () => props.setCheck,
  (val) => {
    check.value = val;
  }
);
</script>

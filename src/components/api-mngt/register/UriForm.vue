<template>
  <li>
    <label class="label point">{{ groupNm }}</label>
    <div class="form-cont">
      <div class="form-group">
        <img class="img" src="@/assets/in.svg" alt="uri" />
        <input type="text" :value="uriIn" class="input-box uri-input" placeholder="자동생성/변경불가" disabled />
      </div>
      <div class="form-group">
        <img class="img" src="@/assets/out.svg" alt="uri" />
        <input
          type="text"
          :value="value"
          class="input-box uri-input"
          placeholder="자동생성/변경불가"
          :disabled="!isEdit"
          @input="handleChangeUri"
        />
        <button class="sm-btn" @click="handleClickEdit">
          <i><img src="@/assets/edit.svg" alt="수정" /></i>
        </button>
      </div>
    </div>
  </li>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  groupNm: string;
  uriIn: string;
  value: string;
  isvalid: boolean;
}>();

const emit = defineEmits<{
  (e: 'input', value: string): void;
  (e: 'update:isvalid', value: boolean): void;
}>();

const isEdit = ref(false);

const handleClickEdit = () => {
  isEdit.value = !isEdit.value;
};

const handleChangeUri = (event: any) => {
  emit('input', event.target.value);
  emit('update:isvalid', Boolean(event.target.value));
};
</script>

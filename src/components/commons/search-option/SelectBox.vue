<template>
  <div>
    <label class="label">{{ props.label }}</label>
    <select class="select-box" @change="handleChangeTarget">
      <option v-for="(item, index) in props.selectOptions" :key="index" :selected="item.label == props.searchTarget">
        {{ item.value }}
      </option>
    </select>
    <input
      type="text"
      class="input-box"
      :value="props.searchValue"
      @change="handleChangeSearchData"
      @keyup="handleKeyup"
    />
  </div>
</template>

<script setup lang="ts">
import type { SelectOptionType } from '@/types/SearchType';

const props = defineProps<{
  label: string;
  selectOptions: SelectOptionType[];
  searchTarget: string;
  searchValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:searchTarget', value: string): void;
  (e: 'update:searchValue', value: string): void;
  (e: 'submit'): void;
}>();

const handleKeyup = (event: any) => {
  if (event.keyCode === 13) {
    emit('submit');
  }
};

const handleChangeTarget = (event: any) => {
  emit('update:searchTarget', props.selectOptions[event.target.selectedIndex].label);
};

const handleChangeSearchData = (event: any) => {
  emit('update:searchValue', event.target.value);
};
</script>

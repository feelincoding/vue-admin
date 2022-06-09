<template>
  <div class="tb-tit">
    <div class="search-cont">
      <label class="label">{{ $t('control.sort_by') }}</label>
      <select class="select-box" @change="handleChangeSort">
        <option v-for="(item, index) in sorts" :key="index" :value="item.value">{{ item.text }}</option>
      </select>
    </div>

    <p class="total">
      {{ $t('common.total') }} : <span>{{ cnt }}</span>
    </p>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n({});

const props = defineProps<{
  cnt?: number;
}>();

const emit = defineEmits<{
  (e: 'changeSort', value: string): void;
}>();

const sorts = [
  {
    value: 'totCnt',
    text: t('control.cnt'),
  },
  {
    value: 'failRate',
    text: t('control.fail_rate'),
  },
  {
    value: 'tps',
    text: t('control.tps'),
  },
  {
    value: 'avgResTm',
    text: t('control.res_time'),
  },
];

onMounted(() => {
  emit('changeSort', 'totCnt');
});

const handleChangeSort = (event: any) => {
  emit('changeSort', event.target.value);
};
</script>

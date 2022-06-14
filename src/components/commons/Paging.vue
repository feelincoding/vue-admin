<template>
  <ul>
    <li class="page-btn" v-show="isShowFirstBtn == true && !isListEmpty">
      <a @click="onChangedPage(1)"><img src="@/assets/page_first.svg" alt="처음" /></a>
    </li>
    <li class="page-btn" v-show="isShowPrevBtn == true && !isListEmpty">
      <a @click="onChangedPage(pagingOption.currentPage - 1)"><img src="@/assets/page_before.svg" alt="이전" /></a>
    </li>
    <li v-for="(page, index) in pageList" :key="index" :class="{ active: page === pagingOption.currentPage }">
      <a @click="onChangedPage(page)">{{ page + 1 }}</a>
    </li>
    <li class="page-btn" v-show="isShowNextBtn == true && !isListEmpty">
      <a @click="onChangedPage(pagingOption.currentPage + 1)"><img src="@/assets/page_after.svg" alt="다음" /></a>
    </li>
    <li class="page-btn" v-show="isShowLastBtn == true && !isListEmpty">
      <a @click="onChangedPage(pagingOption.totalPage)"><img src="@/assets/page_last.svg" alt="마지막" /></a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Pagination } from '@/types/GateWayResponse';
import { computed } from 'vue';

const props = defineProps<{
  pagingOption: Pagination;
  isListEmpty: boolean;
}>();

const pageList = computed((): number[] => {
  const list = [];
  const currQuot = Math.floor(props.pagingOption.currentPage / props.pagingOption.size); //현재 선택한 페이지의 범위
  for (let p = currQuot * props.pagingOption.size; p < endPage.value; p++) {
    list.push(p);
  }
  if (list.length == 0) list.push(0);

  return list;
});

const endPage = computed((): number => {
  const lastPage =
    Math.floor(props.pagingOption.currentPage / props.pagingOption.size) * props.pagingOption.size +
    props.pagingOption.size;
  return lastPage > props.pagingOption.totalPage ? props.pagingOption.totalPage : lastPage;
});
const isShowFirstBtn = computed((): boolean => {
  const rule =
    props.pagingOption.totalPage > 10 &&
    Math.floor(props.pagingOption.currentPage / props.pagingOption.size) * props.pagingOption.size != 0;
  return rule;
});

const isShowPrevBtn = computed((): boolean => {
  const rule = props.pagingOption.currentPage === 0;
  return !rule;
});

const isShowNextBtn = computed((): boolean => {
  const rule = props.pagingOption.currentPage == props.pagingOption.totalPage - 1;
  return !rule;
});

const isShowLastBtn = computed((): boolean => {
  const rule =
    props.pagingOption.totalPage > 10 &&
    Math.floor(props.pagingOption.currentPage / props.pagingOption.size) * props.pagingOption.size !=
      Math.floor(props.pagingOption.totalPage / 10) * 10;
  return rule;
});

const emit = defineEmits<{
  (e: 'onChangedPage:page', value: number): void;
}>();
const onChangedPage = (page: number) => {
  emit('onChangedPage:page', page);
};

// onChangedPage(page: number) {
//   this.$emit('onChangedPage:page', page);
// }
</script>

<style scoped></style>

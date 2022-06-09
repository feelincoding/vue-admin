<template>
  <tr v-if="props.apiData">
    <td @click="routeDetail(props.apiData.id, props.apiData.sysId)" v-text="getIdx(props.index)"></td>
    <td @click="routeDetail(props.apiData.id, props.apiData.sysId)" class="tl">
      {{ apiData.sysId }}
    </td>
    <td @click="routeDetail(props.apiData.id, props.apiData.sysId)" class="tl">{{ props.apiData.id }}</td>
    <td @click="routeDetail(props.apiData.id, props.apiData.sysId)" class="tl">
      <span
        v-for="(method, idx) in props.apiData.meth"
        :key="idx"
        class="badge"
        :class="{
          syan: method == 'GET',
          red: method == 'DELETE',
          blue: method == 'POST',
          violet: method == 'PUT',
        }"
      >
        {{ method }}
      </span>
    </td>
    <td @click="routeDetail(props.apiData.id, props.apiData.sysId)" class="tl">{{ props.apiData.uriIn }}</td>
    <td @click="routeDetail(props.apiData.id, props.apiData.sysId)">{{ props.apiData.timeOut }}</td>
    <td @click="routeDetail(props.apiData.id, props.apiData.sysId)" class="date-txt">
      <span>
        {{ getDate(props.apiData.updDt) }}
      </span>
      <span>
        {{ getHours(props.apiData.updDt) }}
      </span>
    </td>
    <td>
      <button class="mod-btn" @click="routeEdit(apiData.id, apiData.sysId)">
        <i>{{ $t('api.edit') }}</i>
      </button>
      <button class="del-btn" @click="deleteApi(apiData.id, apiData.sysId)">
        <i>{{ $t('api.delete') }}</i>
      </button>
    </td>
  </tr>
</template>
<script setup lang="ts">
import type { ApiDetailResponse } from '@/types/ApiType';
import type { Pagination } from '@/types/GateWayResponse';
import router from '@/router';
import { convertDate, convertTime } from '@/utils/converter';

const props = defineProps<{
  apiData: ApiDetailResponse;
  pagination: Pagination;
  index: number;
}>();

const emit = defineEmits<{
  (e: 'deleteApi', value: any): void;
}>();

const deleteApi = (id: string, sysId: string) => {
  emit('deleteApi', { id, sysId });
};

const getDate = (date: string) => {
  return convertDate(date);
};

const getHours = (date: string) => {
  return convertTime(date);
};

const routeDetail = (id: string, sysId: string) => {
  router.push({ name: 'api-detail', query: { id, sysId } });
};

const routeEdit = (id: string, sysId: string) => {
  router.push({ name: 'api-edit', query: { id, sysId } });
};

const getIdx = (index: number): number => {
  return props.pagination.totalElements - props.pagination.currentPage * 10 - index;
};
</script>

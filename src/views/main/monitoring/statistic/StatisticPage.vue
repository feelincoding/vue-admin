<template>
  <article class="body-cont" @click="handleOnClick">
    <div class="tit-wrap">
      <h1 class="h1-tit">통계</h1>
    </div>

    <div class="tab-wrap">
      <ul>
        <li :class="{ on: selectedTab === 'service' }" @click="selectedTab = 'service'"><a>Service</a></li>
        <li :class="{ on: selectedTab === 'api' }" @click="selectedTab = 'api'"><a>API</a></li>
      </ul>
    </div>

    <StatisticServicePage v-if="selectedTab === 'service'" :isSearchFocus="isSearchFocus" />
    <StatisticApiPage v-if="selectedTab === 'api'" :isSearchFocus="isSearchFocus" />
  </article>
</template>
<script setup lang="ts">
import { ref } from 'vue';

import StatisticServicePage from '@/views/main/monitoring/statistic/service/StaticticServicePage.vue';
import StatisticApiPage from '@/views/main/monitoring/statistic/api/StatisticApiPage.vue';

let selectedTab = ref('service');
let isSearchFocus = ref(false);

const handleOnClick = (event: any) => {
  if (event.path.find((element: HTMLLIElement) => element?.id?.includes('search-focus'))) {
    isSearchFocus.value = true;
  } else {
    isSearchFocus.value = false;
  }
};
</script>

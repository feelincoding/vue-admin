<template>
  <article class="contents-wrap" @click="handleOnClick">
    <div class="tit-wrap">
      <h1 class="h1-tit">{{ $t('traffic.traffic') }}</h1>
    </div>
    <div class="tab-wrap">
      <ul>
        <li :class="{ on: selectedTab === 'service' }" @click="selectedTab = 'service'"><a>Service</a></li>
        <li :class="{ on: selectedTab === 'api' }" @click="selectedTab = 'api'"><a>API</a></li>
      </ul>
    </div>
    <TrafficService v-if="selectedTab === 'service'" :isSearchFocus="isSearchFocus" />
    <TrafficAPI v-if="selectedTab === 'api'" :isSearchFocus="isSearchFocus" />
  </article>
</template>
<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, type Ref } from 'vue';
import TrafficAPI from '@/components/monitoring/TrafficAPI.vue';
import TrafficService from '@/components/monitoring/TrafficService.vue';
const selectedTab = ref('service');
const isSearchFocus = ref(false);
function handleOnClick(event: any) {
  if (event.path.find((element: HTMLLIElement) => element?.id?.includes('search-focus'))) {
    isSearchFocus.value = true;
  } else {
    isSearchFocus.value = false;
  }
}
</script>

<template>
  <article class="body-cont">
    <div class="tit-wrap">
      <h1 class="h1-tit">{{ $t('control.control') }}</h1>
    </div>
    <div class="tab-wrap">
      <ul>
        <li :class="{ on: selectedTab === 'service' }" @click="selectedTab = 'service'">
          <a>{{ $t('control.service') }}</a>
        </li>
        <li :class="{ on: selectedTab === 'api' }" @click="selectedTab = 'api'">
          <a>{{ $t('control.api') }}</a>
        </li>
      </ul>
    </div>

    <ControlServicePage v-if="selectedTab === 'service'" />
    <ControlApiPage v-if="selectedTab === 'api'" />
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import ControlServicePage from '@/views/main/monitoring/control/service/ControlServicePage.vue';
import ControlApiPage from '@/views/main/monitoring/control/api/ControlApiPage.vue';

let selectedTab = ref('service');
</script>

<template>
  <article class="contents-wrap">
    <div class="tit-wrap">
      <h1 class="h1-tit">{{ $t('control.control') }}</h1>
    </div>
    <div class="tab-wrap">
      <ul>
        <li :class="{ on: navState.controlServiceState }">
          <router-link :to="{ name: 'control-service' }">{{ $t('control.service') }}</router-link>
        </li>
        <li :class="{ on: navState.controlApiState }">
          <router-link :to="{ name: 'control-api' }">{{ $t('control.api') }}</router-link>
        </li>
      </ul>
    </div>
    <router-view />
  </article>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import type { Ref } from 'vue';

import { useRoute, type RouteLocationNormalizedLoaded } from 'vue-router';

interface NavState {
  [key: string]: boolean;
  controlServiceState: boolean;
  controlApiState: boolean;
}

const navState: NavState = reactive({
  controlServiceState: false,
  controlApiState: false,
});

const route = useRoute();

watch(
  route,
  (newVal: RouteLocationNormalizedLoaded) => {
    if (newVal.name === 'control-service') {
      navState.controlServiceState = true;
      navState.controlApiState = false;
    } else if (newVal.name === 'control-api') {
      navState.controlServiceState = false;
      navState.controlApiState = true;
    }
  },
  { immediate: true, deep: true }
);
</script>

<style scoped></style>

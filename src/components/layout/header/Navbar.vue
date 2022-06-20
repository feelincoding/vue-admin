<template>
  <aside id="side">
    <div class="logo">
      <router-link :to="`${dashBoardPath}`" @click="changeNavState('dashboardState')"
        ><img src="@/assets/logo.svg" alt="API G/W Admin logo"
      /></router-link>
    </div>

    <div class="member-wrap">
      <div class="flex">
        <i><img src="@/assets/member_ico.svg" alt="멤버 아이콘" /></i>
        <span><strong>홍길동</strong>님</span>
      </div>
      <a class="link" href="javascript:void(0)">로그아웃</a>
    </div>

    <nav id="navi">
      <ul class="navi-list">
        <li class="home" :class="{ on: $route.path.includes('dashboard') }">
          <router-link :to="`${dashBoardPath}`" @click="changeNavState('dashboardState')">Home</router-link>
        </li>
        <li class="sys" :class="{ on: $route.path.includes('system') }">
          <router-link :to="`${systemPath}`" @click="changeNavState('systemState')">System 관리</router-link>
        </li>
        <li class="api" :class="{ on: $route.path.includes('api') }">
          <router-link :to="`${apiPath}`" @click="changeNavState('apiState')">API 관리</router-link>
        </li>
        <li class="serv" :class="{ on: $route.path.includes('service') }">
          <router-link :to="`${servicePath}`" @click="changeNavState('serviceState')">Service 관리</router-link>
        </li>
        <li
          class="monitor"
          :class="{
            on: navState.showMonitoring || $route.path.includes('monitoring'),
          }"
          @mouseenter="changeShowMonitoring()"
          @mouseleave="changeHideMonitoring()"
        >
          <a href="javascript:void(0)">Monitoring 관리</a>
          <!-- <a href="javascript:void(0)" @click="changeShowMonitoring()">Monitoring 관리</a> -->
          <Transition name="fade" appear>
            <div class="depth-menu" v-show="navState.showMonitoring || $route.path.includes('monitoring')">
              <ul>
                <li :class="{ active: $route.path.includes('control') }">
                  <router-link :to="`${monitoringPath}/control`" @click="changeNavState('controlState')"
                    >관제 모니터링</router-link
                  >
                </li>
                <li :class="{ active: $route.path.includes('statistic') }">
                  <router-link :to="`${monitoringPath}/statistic`" @click="changeNavState('statisticState')"
                    >통계 모니터링</router-link
                  >
                </li>
                <li :class="{ active: $route.path.includes('traffic') }">
                  <router-link :to="`${monitoringPath}/traffic`" @click="changeNavState('trafficState')"
                    >트래픽 모니터링</router-link
                  >
                </li>
              </ul>
            </div>
          </Transition>
        </li>
        <li class="manage" :class="{ on: navState.showManagement }">
          <a href="javascript:void(0)">Management</a>
        </li>
        <li class="code" :class="{ on: $route.path.includes('code') }">
          <router-link :to="`${code}`" @click="changeNavState('code')">Code</router-link>
        </li>
      </ul>
    </nav>
    <!------- // navigation -------->
  </aside>
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { SYSTEM, SERVICE, API, MONITORING, MANAGEMENT, CODE } from '@/router/Names';
import { onMounted, ref, type Ref } from 'vue';

interface NavState {
  [key: string]: boolean;
  dashBoardState: boolean;
  systemState: boolean;
  apiState: boolean;
  serviceState: boolean;
  monitoringState: boolean;
  controlState: boolean;
  statisticState: boolean;
  trafficState: boolean;
  managementState: boolean;
  showMonitoring: boolean;
  showManagement: boolean;
  code: boolean;
}

const navState: Ref<NavState> = ref({
  dashBoardState: true,
  systemState: false,
  apiState: false,
  serviceState: false,
  monitoringState: false,
  controlState: false,
  statisticState: false,
  trafficState: false,
  managementState: false,
  showMonitoring: false,
  showManagement: false,
  code: false,
});

const changeShowMonitoring = () => {
  navState.value.showMonitoring = true;
};

const changeHideMonitoring = () => {
  navState.value.showMonitoring = false;
};

const changeNavState = (state: string) => {
  console.log(state);
  for (const key of Object.keys(navState)) {
    navState.value[key] = false;
  }
  navState.value[state] = true;
};

const dashBoardPath = '/dashboard';
const systemPath = SYSTEM;
const apiPath = API;
const servicePath = SERVICE;
const code = CODE;
const monitoringPath = MONITORING;
const managementPath = MANAGEMENT;
</script>

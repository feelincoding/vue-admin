<template>
  <header class="header-wrap">
    <aside class="logo">
      <a href="javascript:void(0)"><img src="@/assets/logo.svg" alt="API G/W Admin logo" /></a>
    </aside>
    <nav id="navi">
      <ul>
        <li :class="{ on: navState.dashboardState }">
          <router-link :to="`${dashBoardPath}`" @click="changeNavState('dashboardState')">Home</router-link>
        </li>
        <li :class="{ on: navState.systemState }">
          <router-link :to="`${systemPath}`" @click="changeNavState('systemState')">시스템 관리</router-link>
        </li>
        <li :class="{ on: navState.apiState }">
          <router-link :to="`${apiPath}`" @click="changeNavState('apiState')">API관리</router-link>
        </li>
        <li :class="{ on: navState.serviceState }">
          <router-link :to="`${servicePath}`" @click="changeNavState('serviceState')">서비스 관리</router-link>
        </li>
        <li :class="{ on: navState.monitoringState }">
          <a href="javascript:void(0)" @click="changeShowMonitoring">모니터링</a>
          <Transition name="fade" appear>
            <div class="depth-menu" v-show="navState.showMonitoring">
              <ul>
                <li>
                  <i><img src="@/assets/user_ico.svg" alt="관제" /></i>
                  <!-- <router-link :to="`${monitoringPath}`">모니터링</router-link> -->
                  <router-link :to="`${monitoringPath}/control`" @click="changeNavState('monitoringState')"
                    >관제</router-link
                  >
                </li>
                <li>
                  <i><img src="@/assets/stati_ico.svg" alt="통계" /></i>
                  <router-link :to="`${monitoringPath}/statistic`" @click="changeNavState('monitoringState')"
                    >통계</router-link
                  >
                </li>
                <li>
                  <i><img src="@/assets/traffic_ico.svg" alt="트래픽" /></i>
                  <router-link :to="`${monitoringPath}/traffic`" @click="changeNavState('monitoringState')"
                    >트래픽</router-link
                  >
                </li>
              </ul>
            </div>
          </Transition>
        </li>
      </ul>
    </nav>
    <!------- // navigation -------->

    <div class="member-wrap">
      <p><span class="bold">홍길동</span>님</p>
      <p><a class="link">로그아웃</a></p>
    </div>
  </header>
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { SYSTEM, SERVICE, API, MONITORING, MANAGEMENT } from '@/router/Names';

interface NavState {
  [key: string]: boolean;
  dashBoardState: boolean;
  systemState: boolean;
  apiState: boolean;
  serviceState: boolean;
  monitoringState: boolean;
  managementState: boolean;
  showMonitoring: boolean;
  showManagement: boolean;
}

const navState: NavState = {
  dashBoardState: true,
  systemState: false,
  apiState: false,
  serviceState: false,
  monitoringState: false,
  managementState: false,
  showMonitoring: false,
  showManagement: false,
};

const changeShowMonitoring = () => {
  if (!navState.showMonitoring) {
    navState.showMonitoring = true;
    if (navState.showManagement) {
      navState.showManagement = false;
    }
  } else {
    navState.showMonitoring = false;
  }
  console.log(navState.showMonitoring);
};

const changeNavState = (state: string) => {
  console.log(state);
  for (const key of Object.keys(navState)) {
    navState[key] = false;
  }
  navState[state] = true;
};

const dashBoardPath = '/dashboard';
const systemPath = SYSTEM;
const apiPath = API;
const servicePath = SERVICE;
const monitoringPath = MONITORING;
const managementPath = MANAGEMENT;
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

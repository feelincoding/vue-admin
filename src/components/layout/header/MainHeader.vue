<template>
  <aside id="side">
    <div class="logo">
      <a href="javascript:void(0)"><img src="@/assets/logo.svg" alt="API G/W Admin logo" /></a>
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
        <li class="home" :class="{ on: navState.dashboardState }">
          <router-link :to="`${dashBoardPath}`" @click="changeNavState('dashboardState')">Home</router-link>
        </li>
        <li class="sys" :class="{ on: navState.systemState }">
          <router-link :to="`${systemPath}`" @click="changeNavState('systemState')">System 관리</router-link>
        </li>
        <li class="api" :class="{ on: navState.apiState }">
          <router-link :to="`${apiPath}`" @click="changeNavState('apiState')">API 관리</router-link>
        </li>
        <li class="serv" :class="{ on: navState.serviceState }">
          <router-link :to="`${servicePath}`" @click="changeNavState('serviceState')">Service 관리</router-link>
        </li>
        <li class="monitor" :class="{ on: navState.monitoringState }">
          <a href="javascript:void(0)" @click="changeShowMonitoring">monitoring 관리</a>
          <Transition name="fade" appear>
            <div class="depth-menu" v-show="navState.showMonitoring">
              <ul>
                <li :class="{ active: navState.monitoringState }">
                  <router-link :to="`${monitoringPath}/control`" @click="changeNavState('monitoringState')"
                    >관제 모니터링</router-link
                  >
                </li>
                <li :class="{ active: navState.monitoringState }">
                  <router-link :to="`${monitoringPath}/statistic`" @click="changeNavState('monitoringState')"
                    >통계 모니터링</router-link
                  >
                </li>
                <li :class="{ active: navState.monitoringState }">
                  <router-link :to="`${monitoringPath}/traffic`" @click="changeNavState('monitoringState')"
                    >트래픽 모니터링</router-link
                  >
                </li>
              </ul>
            </div>
          </Transition>
        </li>
      </ul>
    </nav>
    <!------- // navigation -------->
  </aside>
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { SYSTEM, SERVICE, API, MONITORING, MANAGEMENT } from '@/router/Names';
import { ref, type Ref } from 'vue';

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

const navState: Ref<NavState> = ref({
  dashBoardState: true,
  systemState: false,
  apiState: false,
  serviceState: false,
  monitoringState: false,
  managementState: false,
  showMonitoring: false,
  showManagement: false,
});

const changeShowMonitoring = () => {
  if (!navState.value.showMonitoring) {
    navState.value.showMonitoring = true;
    if (navState.value.showManagement) {
      navState.value.showManagement = false;
    }
  } else {
    navState.value.showMonitoring = false;
  }
  console.log(navState.value.showMonitoring);
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

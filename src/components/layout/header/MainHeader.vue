<template>
  <header class="header-wrap">
    <aside class="logo">
      <a href="javascript:void(0)"><img src="@/assets/logo.svg" alt="API G/W Admin logo" /></a>
    </aside>

    <!------- navigation -------->
    <nav id="navi">
      <ul>
        <li>
          <!-- <router-link :to="`${dashBoardPath}`" @click="changeNavState('dashboardState')">Home</router-link> -->
          <router-link :to="`dash`">Home</router-link>
        </li>
        <li><RouterLink :to="`${systemPath}`">시스템 관리</RouterLink></li>
        <li>API관리</li>
        <li>서비스 관리</li>
        <li>모니터링</li>
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
import { SYSTEM, SERVICE, API, MONITORING, MANAGEMENT } from '@/router/Names';

const dashBoardPath = '/dashboard';
const systemPath = SYSTEM;
</script>

<style scoped></style>

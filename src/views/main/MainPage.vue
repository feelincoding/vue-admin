<template>
  <div class="body-wrap">
    <div class="wrap">
      <MainHeader />
      <router-view />
      <MainFooter></MainFooter>
      <ModalLayout
        v-if="showAlert"
        :alert="true"
        errorTitle="정보"
        :errorDesc="message"
        @close="showAlert = false"
        size="s"
      >
        <!-- <template v-slot:modalContainer> {{ message }} </template> -->
      </ModalLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

import MainHeader from '@/components/layout/header/MainHeader.vue';
import MainFooter from '@/components/layout/footer/MainFooter.vue';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
const showAlert = ref(false);
const message = ref('');
</script>

<style scoped></style>

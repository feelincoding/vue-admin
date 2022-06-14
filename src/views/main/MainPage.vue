<template>
  <div class="body-wrap">
    <div class="wrap">
      <Navbar />
      <article class="body-cont" v-if="currentPageName !== 'dashBoard'">
        <router-view />
        <MainFooter></MainFooter>
      </article>
      <router-view v-else />
      <ModalLayout
        v-if="showModal"
        :alert="true"
        errorTitle="정보"
        :errorDesc="modalMessage"
        @close="showModal = false"
        size="s"
      >
      </ModalLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { provide } from 'vue';
import Navbar from '@/components/layout/header/Navbar.vue';
import MainFooter from '@/components/layout/footer/MainFooter.vue';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
import { modalInjectionKey, type ModalFunction } from '@/plugins/modal/ModalPlugin';
import { useRoute } from 'vue-router';
const route = useRoute();

const showModal = ref(false);
const modalMessage = ref('');

const updateScore: ModalFunction = function () {
  return {
    show: function (message: string): void {
      showModal.value = true;
      modalMessage.value = message;
    },
    hide: function (): void {
      showModal.value = false;
    },
  };
};
let currentPageName = ref(route.name);

provide(modalInjectionKey, updateScore);
</script>

<style scoped></style>

<template>
  <div class="body-wrap">
    <div class="wrap">
      <Navbar />
      <router-view />
      <!-- <MainFooter></MainFooter> -->
      <ModalLayout
        v-if="showModal"
        :alert="true"
        errorTitle="정보"
        :errorDesc="modalMessage"
        @close="showModal = false"
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
import { provide } from 'vue';
import Navbar from '@/components/layout/header/Navbar.vue';
// import MainFooter from '@/components/layout/footer/MainFooter.vue';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
import { modalInjectionKey, type IModal, type ModalFunction } from '@/plugins/modal/ModalPlugin';
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

provide(modalInjectionKey, updateScore);
</script>

<style scoped></style>

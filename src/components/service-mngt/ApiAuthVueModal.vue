<template>
  <transition v-if="showApiAuthModal" id="app" class="body-wrap" name="modal">
    <div class="modal-overlay">
      <!------- handler pop -------->
      <div class="pop-wrap mid-pop">
        <div class="pop-header">
          <h2 class="h2-tit">API 권한설정 List</h2>
          <button @click="hideApiAuth">
            <i><img src="@/assets/close.svg" alt="닫기" title="닫기" /></i>
          </button>
        </div>
        <div class="pop-container">
          <p class="total">
            total : <span>{{ countApiList }}</span>
          </p>
          <!--  end-point list -->
          <div class="pop-tb-wrap">
            <table class="sm-tb">
              <caption>
                시스템 ID, API ID 항목 테이블
              </caption>
              <colgroup>
                <col width="30%" />
                <col width="*" />
              </colgroup>
              <thead>
                <tr>
                  <th>시스템 ID</th>
                  <th>API ID</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="system in checkedApiList">
                  <tr v-for="(api, apiIndex) in system.apiId" :key="api">
                    <td v-if="apiIndex == 0" :rowspan="system.apiId.length" class="tl">{{ system.sysId }}</td>
                    <td class="tl">{{ api }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <!--  // end-point list -->
        </div>
        <!--  // pop-container   -->

        <div class="pop-footer">
          <button class="lg-btn purple-btn" @click="hideApiAuth">확인</button>
        </div>
      </div>
      <!------- handler pop -------->
    </div>
  </transition>
</template>

<script setup lang="ts">
import type { ApiAuthResponse } from '@/types/ServiceType';
import { BSpinner } from 'bootstrap-vue-3';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
import { ref, watch } from 'vue';
import type { Ref } from 'vue';
const props = defineProps<{
  setCheckedApiList: ApiAuthResponse[];
  setIsApiAuthProgress: boolean;
  setShowApiAuthModal: boolean;
  setCountApiList: number;
}>();
const emit = defineEmits<{
  (e: 'hideApiAuth'): void;
}>();

const checkedApiList: Ref<ApiAuthResponse[]> = ref([]);
const searchText = ref('');
const countApiList = ref(0);
const isApiAuthProgress = ref(false);
const showApiAuthModal = ref(false);

watch(
  () => props.setCountApiList,
  (val) => {
    countApiList.value = val;
  }
);
watch(
  () => props.setCheckedApiList,
  (val) => {
    checkedApiList.value = val;
  }
);
watch(
  () => props.setIsApiAuthProgress,
  (val) => {
    isApiAuthProgress.value = val;
  }
);
watch(
  () => props.setShowApiAuthModal,
  (val) => {
    showApiAuthModal.value = val;
  }
);

const hideApiAuth = () => {
  emit('hideApiAuth');
};
</script>
<style>
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
</style>

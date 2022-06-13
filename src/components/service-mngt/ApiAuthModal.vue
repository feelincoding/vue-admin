<template>
  <transition v-if="showApiAuthModal" id="app" class="body-wrap" name="modal">
    <div class="modal-overlay">
      <!------- handler pop -------->
      <div class="pop-wrap lg-pop">
        <div class="pop-header">
          <h1 class="h1-tit">{{ $t('service.api_mngt') }}</h1>
          <button @click="hideApiAuth">
            <i><img src="@/assets/close.svg" alt="닫기" title="닫기" /></i>
          </button>
        </div>
        <div class="pop-container" v-if="isApiAuthProgress">
          <div class="api-wrap" style="height: 100%; display: flex; align-items: center">
            <b-spinner large style="margin: 0 auto; vertical-align: middle"></b-spinner>
          </div>
        </div>
        <div class="pop-container" v-if="!isApiAuthProgress">
          <div class="api-wrap">
            <div class="comp">
              <div class="search-form">
                <input class="input-box" type="text" placeholder="API 검색" v-model="searchText" @input="searchApi" />
              </div>
              <ul class="api-list">
                <li v-for="(system, sysIndex) in apiList" :key="sysIndex">
                  <a class="stick">{{ system.sysId }}</a>
                  <div class="api-group">
                    <div class="check-all">
                      <div class="check-box">
                        <div class="check">
                          <input
                            type="checkbox"
                            :id="system.sysId + '-all'"
                            :checked="
                              checkedApiList.find((item) => item.sysId === system.sysId) &&
                              checkedApiList.find((item) => item.sysId === system.sysId).apiId.length ===
                                system.apiId.length
                            "
                            @click="checkApiAll(system)"
                          /><span class="checkmark"></span>
                        </div>
                        <label :for="system.sysId + '-all'">{{ $t('service.total_select') }}</label>
                      </div>
                    </div>
                    <div class="check-group">
                      <div class="check-box" v-for="(api, apiIndex) in system.apiId" :key="apiIndex">
                        <div class="check">
                          <input
                            type="checkbox"
                            :id="api"
                            :checked="
                              checkedApiList.find((item) => item.sysId === system.sysId) &&
                              checkedApiList.find((item) => item.sysId === system.sysId).apiId.includes(api)
                            "
                            @click="checkApi(system.sysId, api)"
                          /><span class="checkmark"></span>
                        </div>
                        <label :for="api">{{ api }}</label>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="comp gray">
              <div class="box-tit">
                <h3 class="h3-tit">{{ $t('service.selected_api') }}</h3>
                <p class="total">
                  total : <span>{{ countApiList }}</span>
                </p>
              </div>

              <div class="api-cont">
                <div v-for="(sys, index) in checkedApiList" :key="index" class="api-add">
                  <h6 v-if="sys" class="h6-tit">{{ sys.sysId }}</h6>
                  <div class="api-stick" v-for="(checkedApi, index) in sys.apiId" :key="index">
                    <span>{{ checkedApi }}</span>
                    <button @click="deleteApi(sys.sysId, checkedApi)">
                      <i><img src="@/assets/close.svg" alt="닫기" title="닫기" /></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--  // pop-container   -->

        <div class="pop-footer">
          <button class="lg-btn purple-btn" @click="registerApi" :disabled="isApiAuthProgress">
            {{ $t('common.save') }}
          </button>
          <button class="lg-btn white-btn" @click="hideApiAuth" :disabled="isApiAuthProgress">
            {{ $t('common.cancel') }}
          </button>
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
import { disableScrolling, enableScrolling } from '@/utils/screen';
import { ref, watch } from 'vue';
import type { Ref } from 'vue';

const props = defineProps<{
  setApiList?: ApiAuthResponse[];
  setCheckedApiList?: ApiAuthResponse[];
  setShowApiAuthModal?: Boolean;
  setCountApiList?: Number;
  setIsApiAuthProgress?: Boolean;
}>();
const emit = defineEmits<{
  (e: 'checkApiAll', value: ApiAuthResponse): void;
  (e: 'checkApi', value: { sys: string; api: string }): void;
  (e: 'deleteApi', value: { sys: string; api: string }): void;
  (e: 'searchApi', value: string): void;
  (e: 'registerApi', value: ApiAuthResponse[]): void;
  (e: 'hideApiAuth'): void;
}>();

const searchText = ref('');
const countApiList = ref(0);
const apiList: Ref<ApiAuthResponse[]> = ref([]);
const checkedApiList: Ref<ApiAuthResponse[]> = ref([]);
const isApiAuthProgress = ref(false);
const showApiAuthModal = ref(false);

watch(
  () => props.setCountApiList,
  (val) => {
    countApiList.value = val as number;
  }
);
watch(
  () => props.setApiList,
  (val) => {
    apiList.value = val as ApiAuthResponse[];
  }
);
watch(
  () => props.setCheckedApiList,
  (val) => {
    checkedApiList.value = val as ApiAuthResponse[];
  }
);
watch(
  () => props.setIsApiAuthProgress,
  (val) => {
    isApiAuthProgress.value = val as boolean;
  }
);
watch(
  () => props.setShowApiAuthModal,
  (val) => {
    showApiAuthModal.value = val as boolean;
    if (val) {
      disableScrolling();
    } else {
      enableScrolling();
    }
  }
);

const checkApiAll = (system: ApiAuthResponse) => {
  emit('checkApiAll', system);
};
const deleteApi = (sys: string, api: string) => {
  emit('deleteApi', { sys, api });
};
const checkApi = (sys: string, api: string) => {
  emit('checkApi', { sys, api });
};
const hideApiAuth = () => {
  emit('hideApiAuth');
};
const searchApi = () => {
  emit('searchApi', searchText.value);
};
const registerApi = () => {
  emit('registerApi', checkedApiList.value);
};
</script>

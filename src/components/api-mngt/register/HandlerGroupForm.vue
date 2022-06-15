<template>
  <li>
    <label class="label point">{{ $t('api.reqHndlrGrp') }}</label>
    <div class="form-cont">
      <!--  multi select -->
      <div class="multi-wrap">
        <div ref="selectRow" class="select-row inside-click req-class" @click="requestHandleOnClickGroup">
          {{ props.reqHandlerGroupId ? props.reqHandlerGroupId : chooseReqHandlerGroup }}
        </div>
        <!--  dropdown시 active class 추가-->
        <div ref="selectFrom" class="select-form inside-click" :class="{ none: !isSelectOpenRequest }">
          <!--  dropdown시 block class 추가-->
          <ul class="inside-click">
            <li class="inside-click" v-for="(handlerGroup, index) in props.reqHandlerGroupList" :key="index">
              <span
                class="inside-click"
                @click="[handleSelectReqHandlerGroup(handlerGroup.id), (chooseReqHandlerGroup = handlerGroup.id)]"
                >{{ handlerGroup.id }}</span
              >
              <p ref="multiBtn" class="multi-btn inside-click" @click="showReqModalMethod(handlerGroup.id)"></p>
            </li>
            <HandlerModal :handlerGroup="sendHandlerGroup" v-if="showReqModal" @close="showReqModal = false" size="l" />
          </ul>
        </div>
      </div>
      <!--  // multi select -->
    </div>
  </li>
  <li>
    <label class="label point">{{ $t('api.resHndlrGrp') }}</label>
    <div class="form-cont">
      <!--  multi select -->
      <div class="multi-wrap">
        <div ref="selectRow" class="select-row inside-click res-class" @click="responseHandleOnClickGroup">
          {{ resHandlerGroupId ? resHandlerGroupId : chooseResHandlerGroup }}
        </div>
        <!--  dropdown시 active class 추가-->
        <div ref="selectFrom" class="select-form inside-click" :class="{ none: !isSelectOpenResponse }">
          <!--  dropdown시 block class 추가-->
          <ul class="inside-click">
            <li class="inside-click" v-for="(handlerGroup, index) in resHandlerGroupList" :key="index">
              <span
                class="inside-click"
                @click="[handleSelectResHandlerGroup(handlerGroup.id), (chooseResHandlerGroup = handlerGroup.id)]"
                >{{ handlerGroup.id }}</span
              >
              <p ref="multiBtn" class="multi-btn inside-click" @click="showResModalMethod(handlerGroup.id)"></p>
            </li>
            <HandlerModal :handlerGroup="sendHandlerGroup" v-if="showResModal" @close="showResModal = false" size="m" />
          </ul>
        </div>
      </div>
      <!--  // multi select -->
    </div>
  </li>
</template>
<script setup lang="ts">
import type { HandlerGroupDetail } from '@/types/HandlerType';
import HandlerModal from '@/components/api-mngt/register/HandlerModal.vue';
import { onMounted, ref, type Ref } from 'vue';

const isSelectOpenResponse = ref(false);
const isSelectOpenRequest = ref(false);
const chooseReqHandlerGroup = ref('handler 그룹을 선택해주세요');
const chooseResHandlerGroup = ref('handler 그룹을 선택해주세요');
const showReqModal = ref(false);
const showResModal = ref(false);
const sendHandlerGroup: Ref<HandlerGroupDetail> = ref({
  id: '',
  hndlr: [],
  desc: '',
});

const props = defineProps<{
  reqHandlerGroupList: HandlerGroupDetail[];
  resHandlerGroupList: HandlerGroupDetail[];
  reqHandlerGroupId: string;
  resHandlerGroupId: string;
}>();

const emit = defineEmits<{
  (e: 'reqInput', handlerGroupId: string): void;
  (e: 'resInput', handlerGroupId: string): void;
}>();

const requestHandleOnClickGroup = (): void => {
  isSelectOpenRequest.value = !isSelectOpenRequest.value;
};

const responseHandleOnClickGroup = (): void => {
  isSelectOpenResponse.value = !isSelectOpenResponse.value;
};

const onClick = (e: any): void => {
  const insideClick = e.target.classList as object;
  if (Object.values(insideClick).includes('req-class')) {
    if (isSelectOpenResponse.value) {
      isSelectOpenResponse.value = false;
    }
  }

  if (!Object.values(insideClick).includes('inside-click') && isSelectOpenRequest.value) {
    requestHandleOnClickGroup();
    isSelectOpenRequest.value = false;
    showReqModal.value = false;
  }

  if (!Object.values(insideClick).includes('inside-click') && isSelectOpenResponse.value) {
    responseHandleOnClickGroup();
    isSelectOpenResponse.value = false;
    showResModal.value = false;
  }
};

const showReqModalMethod = (apiGroupId: string | number) => {
  for (let index = 0; index < props.reqHandlerGroupList.length; index++) {
    const handlerGroup = props.reqHandlerGroupList[index];
    if (handlerGroup.id == apiGroupId) {
      sendHandlerGroup.value = handlerGroup;
      break;
    }
  }
  showReqModal.value = true;
};

const showResModalMethod = (apiGroupId: string | number) => {
  for (let index = 0; index < props.resHandlerGroupList.length; index++) {
    const handlerGroup = props.resHandlerGroupList[index];
    if (handlerGroup.id == apiGroupId) {
      sendHandlerGroup.value = handlerGroup;
      break;
    }
  }
  showResModal.value = true;
};

const handleSelectReqHandlerGroup = (handlerGroupId: string): void => {
  emit('reqInput', handlerGroupId);
  isSelectOpenRequest.value = false;
};

const handleSelectResHandlerGroup = (handlerGroupId: string): void => {
  emit('resInput', handlerGroupId);
  isSelectOpenResponse.value = false;
};

onMounted(() => {
  const registerPage = document.getElementById('api-register') as HTMLElement;
  registerPage.addEventListener('click', onClick);
  registerPage.removeEventListener;
});
</script>

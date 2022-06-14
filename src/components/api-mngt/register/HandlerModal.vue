<template>
  <transition name="modalLayout">
    <!------- handler pop -------->
    <div :class="{ large: l, 'mid-pop': m, 'sm-pop': s, 'lg-pop': lg, 'pop-wrap': true }">
      <div class="pop-header inside-click">
        <h1 class="h1-tit inside-click">{{ props.handlerGroup.id }}</h1>
        <button class="inside-click" @click="$emit('close')">
          <i class="inside-click"><img class="inside-click" src="@/assets/close.svg" alt="닫기" title="닫기" /></i>
        </button>
      </div>
      <div class="pop-container inside-click">
        <p class="text inside-click">{{ props.handlerGroup.desc }}</p>

        <ul class="handler-list inside-click">
          <li class="inside-click" v-for="(eachApi, index) in props.handlerGroup.hndlr" :key="index">
            <span class="inside-click">{{ eachApi.id }}</span>
            <p
              v-on:mouseout="handleMouseOut"
              v-on:mouseover="[changeApiDesc(eachApi.desc)]"
              href=""
              class="tip-btn inside-click"
            >
              <i><img src="@/assets/tip.svg" alt="팁" /></i>
            </p>
          </li>
          <HoverModal v-if="showHoverModal" @close="showHoverModal = false" :apiDesc="sendApiDesc">
            <!-- <h3 slot="header">custom header</h3> -->
          </HoverModal>
        </ul>
      </div>
      <div class="pop-footer inside-click">
        <button class="lg-btn purple-btn inside-click" @click="$emit('close')">ok</button>
      </div>
    </div>
    <!------- handler pop -------->
  </transition>
</template>
<script setup lang="ts">
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
import HoverModal from '@/components/api-mngt/register/HoverModal.vue';
import type { HandlerGroupDetail } from '@/types/HandlerType';
import { ref, onMounted } from 'vue';

const showHoverModal = ref(false);
const sendApiDesc = ref('');
const l = ref(false);
const m = ref(false);
const s = ref(false);
const lg = ref(false);

const props = defineProps<{
  handlerGroup: HandlerGroupDetail;
  size: string;
}>();

onMounted(() => {
  if (props.size == 'l') {
    l.value = true;
    m.value = false;
    s.value = false;
    lg.value = false;
  } else if (props.size == 'm') {
    l.value = false;
    m.value = true;
    s.value = false;
    lg.value = false;
  } else if (props.size == 's') {
    l.value = false;
    m.value = false;
    s.value = true;
    lg.value = false;
  } else if (props.size == 'lg') {
    l.value = false;
    m.value = false;
    s.value = false;
    lg.value = true;
  }
});

const handleMouseOut = () => {
  // this.handlerGroup.hndlrId
  if (showHoverModal.value) {
    showHoverModal.value = false;
  }
};

const handleMouseOver = (event: MouseEvent) => {
  if (!showHoverModal.value) {
    showHoverModal.value = true;
  }
};

const changeApiDesc = (apiDesc: string) => {
  if (!showHoverModal.value) {
    sendApiDesc.value = apiDesc;
    showHoverModal.value = true;
  }
};
</script>
<style>
/***   popup   ***/
.large {
  width: 600px;
}
/* .medium {
  width: 400px;
}
.small {
  width: 200px;
}
.pop-wrap {
  position: fixed;
  z-index: 9998;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: table;
  transition: opacity 0.3s ease;
  border: 1px #ddd solid;
  border-radius: 30px;
  padding: 30px 30px;
  margin: 0 auto;
  box-shadow: 1px 1px 5px #ccc;
}

.pop-header {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.pop-footer {
  position: relative;
  text-align: center;
  padding: 20px 20px 0px 20px;
  border-top: 1px #ddd solid;
}
.pop-footer .lg-btn {
  padding: 12px 20px;
  margin-right: 10px;
}

.pop-container {
  width: auto;
  overflow-y: auto;
  position: relative;
  max-height: 320px;
}

.handler-list {
  position: relative;
  margin-top: 20px;
}
.handler-list li {
  position: relative;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 15px;
  height: 36px;
}
.handler-list li::before {
  display: block;
  content: '-';
  position: absolute;
  left: 10px;
}

.handler-list li span {
  padding-left: 10px;
  color: #333;
  font-size: 16px;
  line-height: 36px;
  font-weight: 400;
}
.handler-list li:hover span,
.handler-list li:focus span {
  color: #8041f7;
}
.handler-list li .tip-btn {
  display: none;
}

.handler-list li:hover,
.multi-wrap .handler-list li:focus {
  cursor: pointer;
  background-color: #ece1fe;
}
.handler-list li:hover .tip-btn,
.handler-list li:hover .tip-btn:focus {
  display: block;
}

.tip-box {
  padding: 15px 15px;
  max-width: 200px;
  max-height: 100px;
  z-index: 5;
  background: #777777;
  border-radius: 8px;
  color: #ffffff;
} */
</style>

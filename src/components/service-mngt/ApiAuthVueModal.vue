<template>
  <transition v-if="showApiAuthModal" id="app" class="body-wrap" name="modal">
    <div class="modal-overlay">
      <!------- handler pop -------->
      <div class="pop-wrap mid-pop">
        <div class="pop-header">
          <h1 class="h1-tit">
            API 권한설정 List
            <p class="total">
              total : <span>{{ countApiList }}</span>
            </p>
          </h1>
          <button @click="hideApiAuth">
            <i><img src="@/assets/close.svg" alt="닫기" title="닫기" /></i>
          </button>
        </div>
        <div class="pop-container">
          <!--  end-point list -->
          <div class="tb-wrap">
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

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ApiAuthResponse } from '@/types/ServiceType';
import { BSpinner } from 'bootstrap-vue';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';

@Component({
  components: {
    BSpinner,
    ModalLayout,
  },
})
export default class ApiAuthVueModal extends Vue {
  @Prop({ default: () => [] }) setCheckedApiList!: ApiAuthResponse[];
  @Prop({ default: false }) setIsApiAuthProgress!: boolean;
  @Prop({ default: false }) setShowApiAuthModal!: boolean;
  @Prop({ default: 0 }) setCountApiList!: number;

  searchText = '';
  countApiList = 0;
  @Watch('setCountApiList')
  onCountSetApiList(val: number) {
    this.countApiList = val;
  }

  checkedApiList: ApiAuthResponse[] = [];
  @Watch('setCheckedApiList')
  checkedApiListChanged(val: ApiAuthResponse[]) {
    this.checkedApiList = val;
  }

  isApiAuthProgress = false;
  @Watch('setIsApiAuthProgress')
  isApiAuthProgressChanged(val: boolean) {
    this.isApiAuthProgress = val;
  }

  showApiAuthModal = false;
  @Watch('setShowApiAuthModal')
  showApiAuthModalChanged(val: boolean) {
    this.showApiAuthModal = val;
  }

  hideApiAuth() {
    this.$emit('hideApiAuth');
  }
}
</script>

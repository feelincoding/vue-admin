<!-- <template>
  <div class="chart-wrap">
    <h3 class="h3-tit">{{ $t('dash-board.service_top5_title') }}</h3>

    <ul class="list-wrap" style="margin-bottom: 0">
      <ErrorWrapper v-show="isCommError" />

      <li v-for="(item, index) in top5List" :key="index">
        <p class="id-txt">{{ item.svcId }}</p>
        <dl>
          <dt>
            <em>{{ $t('common.total') }} :</em>{{ item.totCnt }}
          </dt>
          <dd>
            <span class="syan">{{ item.sucesCnt }}</span
            >/<span class="red">{{ item.failCnt }}</span>
          </dd>
        </dl>
        <div class="sm-bar">{{ $t('dash-board.success_rate') }}</div>
        <ProgressBar :listItem="item" />
        <button class="more-btn" @click="(showApiDetailModal = true), (serviceDetailData = item), clickModalBtn(item)">
          <i><img src="@/assets/more_ico.svg" :alt="$t('common.more')" /></i>
        </button>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, PropSync } from 'vue-property-decorator';
import ProgressBar from '@/components/commons/ProgressBar.vue';
import ApiDetailModal from '@/components/commons/modal/ApiDetailModal.vue';
import { RealTimeServiceStat, ServiceStat } from '@/types/DashBoardType';
import ErrorWrapper from '@/components/dash-board/ErrorWrapper.vue';

@Component({
  components: {
    ProgressBar,
    ApiDetailModal,
    ErrorWrapper,
  },
})
export default class ApiTop5 extends Vue {
  @Prop() realTimeStat!: RealTimeServiceStat;
  @PropSync('isCommError', { type: Boolean, default: false }) syncedIsCommError!: boolean;
  serviceDetailData?: ServiceStat;
  showApiDetailModal = false;
  top5List: ServiceStat[] = [];
  @Watch('realTimeStat')
  onRealTimeStatChange() {
    this.top5List = this.realTimeStat.svcStat.sort((a, b) => b.totCnt - a.totCnt).slice(0, 5);
  }
  clickModalBtn(item: ServiceStat) {
    this.$emit('clickModalBtn', item);
  }
}
</script>
<style></style> -->

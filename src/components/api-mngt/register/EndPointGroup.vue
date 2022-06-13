<template>
  <li>
    <label class="label">{{ props.groupNm }}</label>
    <div class="form-cont">
      <!--  end-point list -->
      <div class="tb-wrap">
        <table class="sm-tb" v-if="props.edptList">
          <caption>
            URL 항목 테이블
          </caption>
          <colgroup>
            <col width="10%" />
            <col width="*" />
          </colgroup>
          <thead>
            <tr>
              <th>No.</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(edpt, index) in props.edptList" :key="index">
              <td>{{ index + 1 }}</td>
              <td class="tl">{{ edpt }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--  // end-point list -->
    </div>
  </li>
</template>
<script setup lang="ts">
const props = defineProps<{
  groupNm: string;
  edptList: string[];
}>();
</script>

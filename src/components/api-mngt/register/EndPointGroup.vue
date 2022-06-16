<template>
  <li>
    <label class="label">{{ props.groupNm }}</label>
    <div class="form-cont">
      <!--  end-point list -->
      <div class="sub-group">
        <ul>
          <li v-for="(edpt, index) in props.edptList" :key="index">
            <p class="black-txt">{{ edpt }}</p>
          </li>
        </ul>
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

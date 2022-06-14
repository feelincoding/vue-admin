<template>
  <li>
    <label class="label">{{ props.inputNm }}</label>
    <div class="form-cont">
      <div class="form-group">
        <span
          v-for="(item, index) in props.methods"
          :key="index"
          class="badge"
          :class="{
            syan: item == 'GET',
            red: item == 'DELETE',
            blue: item == 'POST',
            violet: item == 'PUT',
          }"
        >
          {{ item }}
        </span>
      </div>
    </div>
  </li>
</template>
<script setup lang="ts">
const props = defineProps<{
  inputNm: string;
  methods: string[];
}>();
</script>

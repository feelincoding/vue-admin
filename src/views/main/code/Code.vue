<template>
  <div id="container" style="height: 1000px">
    <h1 class="h1-tit">핸들러 코드 작성</h1>
    <FilePond
      instant-upload="false"
      label-idle="Drop files here..."
      :allow-multiple="false"
      :credits="'false'"
      allow-revert="false"
      accepted-file-types=".java"
      @addfile="addFile"
      @error="onFilesError"
    />
    <MonacoEditor ref="ttttt" :editorValue="editorValue"></MonacoEditor>
    <button @click="">TTEEESETSEESTSTES</button>
  </div>
</template>

<script setup lang="ts">
import FilePondPluginFileValidateType from '@/plugins/filepond';
import { ref } from 'vue';
import vueFilePond from 'vue-filepond';
import 'filepond/dist/filepond.min.css';

import MonacoEditor from '@/components/commons/code/MonacoEditor.vue';

const editorValue = ref('');
const FilePond = vueFilePond(FilePondPluginFileValidateType);

const onFilesError = (files: any) => {
  console.log(files);
};

const addFile = (error: any, _file: any) => {
  console.log('addFile!!');
  const file = _file.file;

  let reader = new FileReader();
  reader.readAsText(file as Blob);

  reader.onload = (e) => {
    var result = confirm('내용이 이미 있습니다. 덮어 쓰겠습니까?');
    if (result) {
      editorValue.value = reader.result as string;
      console.log(reader.result);
    } else {
    }
  };
};
const ttttt = ref<HTMLDivElement | null>(null);
</script>

<style>
[data-filepond-item-state*='error'] .filepond--item-panel,
[data-filepond-item-state*='invalid'] .filepond--item-panel {
  background-color: red;
}

[data-filepond-item-state='processing-complete'] .filepond--item-panel {
  background-color: green;
}
.filepond--drop-label {
  background-color: #ecf7e9;
  height: auto !important;
}
.filepond--item-panel {
  background-color: rgb(62, 159, 65);
}
.filepond--drip-blob {
  background-color: #999;
}
img {
  width: 25%;
  opacity: 0.8;
  filter: grayscale(100%);
  border-radius: 8px;
  cursor: pointer;
}
</style>

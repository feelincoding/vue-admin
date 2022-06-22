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
      @removefile="onRemoveFile"
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
import { defaultHanlderCode } from './DefaultHandlerCode';

const editorValue = ref('');
const FilePond = vueFilePond(FilePondPluginFileValidateType);

const onRemoveFile = (error: any, file: any) => {
  editorValue.value = defaultHanlderCode;
};

const onFilesError = (files: any) => {
  console.log(files);
};

const addFile = (error: any, _file: any) => {
  console.log('addFile!!');
  const file = _file.file;

  let reader = new FileReader();
  reader.readAsText(file as Blob);

  reader.onload = (e) => {
    // var result = confirm('내용이 이미 있습니다. 덮어 쓰겠습니까?');
    // if (result) {
    editorValue.value = reader.result as string;
    console.log(reader.result);
    // } else {
    // }
  };
};
const ttttt = ref<HTMLDivElement | null>(null);
</script>

<style>
/** 파일 타입 실패 색 */
[data-filepond-item-state*='error'] .filepond--item-panel,
[data-filepond-item-state*='invalid'] .filepond--item-panel {
  background-color: red;
}
/** 파일 타입 성공 색 */
[data-filepond-item-state='processing-complete'] .filepond--item-panel {
  background-color: green;
}
/** 파일 넣기 전 배경(background) & 글자 색(color) */
.filepond--drop-label {
  color: white;
  background-color: #0c233a;
  border-radius: 0.5em;
  height: auto !important;
}
/** 파일 넣은 후 파일 색 */
.filepond--item-panel {
  background-color: #989fb2;
}
/** 파일 넣기 후 배경 색 */
.filepond--panel-root {
  background-color: #0c233a;
}
</style>

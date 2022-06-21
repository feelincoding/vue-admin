<template>
  <div id="container" style="height: 1000px">
    <h1 class="h1-tit">핸들러 코드 작성</h1>
    <FilePond
      instant-upload="false"
      label-idle="Drop files here..."
      v-bind:allow-multiple="false"
      allow-revert="false"
      accepted-file-types=".java"
      @updatefiles="onFilesUpdated"
      @error="onFilesError"
    />
    <div id="editor-section" style="height: 80%"></div>
  </div>
</template>

<script setup lang="ts">
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { ref, reactive, computed, watch, onMounted, inject } from 'vue';
import * as monaco from 'monaco-editor';
import vueFilePond from 'vue-filepond';
import 'filepond/dist/filepond.min.css';

const FilePond = vueFilePond(FilePondPluginFileValidateType);

const codeEditor = ref();
const file = ref(null);

const initEditor = () => {
  codeEditor.value = monaco.editor.create(document.getElementById('editor-section') as HTMLDivElement, {
    value: code.value,
    language: 'java',
    theme: 'vs',
    fontSize: 15,
    lineNumbers: 'on',
    domReadOnly: true,
    dragAndDrop: true,
    minimap: {
      enabled: true,
    },
  });
};

const myFiles: string[] = [];
const runCode = () => {
  console.log('runCode');
  console.log(codeEditor.value.getValue());
};

const onFilesError = (files: any) => {
  console.log(files);
};

const onFilesUpdated = (files: File) => {
  console.log(files);
};

onMounted(() => {
  initEditor();
});

const code = ref(`package com.ktds.act.apigw.filter.handler.request.convertBody;

import java.util.Map;
import org.springframework.stereotype.Component;
import com.ktds.act.apigw.filter.handler.RouteHandler;
import com.ktds.act.apigw.filter.model.TransactionDto;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component(value = "REQ.CONVERT-BODY")
public class RequestConvertBodyHandler implements RouteHandler {

  @Override
	public boolean init(Map<String, Object> configMap) {
		log.info("REQ.CONVERT-BODY - Init");
		return true;
	}
	@Override
	public boolean process(TransactionDto transaction) {
		log.info("REQ.CONVERT-BODY - Start");

		// if(transaction.getRequestData().getBody()!=null){
		// 	log.info("요청 바디 : " + new String(transaction.getRequestData().getBody(), Charset.forName("UTF-8")));
		// 	log.info("바디 정보 변경 : request");
		// 	transaction.getRequestData().setBody("request".getBytes(Charset.forName("UTF-8")));
		// }
		log.info("REQ.CONVERT-BODY - End");
		return true;
	}
}`);

// onMounted(() => {});
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
  background-color: #555;
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

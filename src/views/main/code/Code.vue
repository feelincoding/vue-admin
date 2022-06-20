<template>
  <div id="container" style="height: 1000px">
    <h1 class="h1-tit">핸들러 코드 작성</h1>
    <p></p>
    <div id="editor-section" style="height: 80%"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, inject } from 'vue';
import * as monaco from 'monaco-editor';

const codeEditor = ref();

function initEditor() {
  codeEditor.value = monaco.editor.create(document.getElementById('editor-section') as HTMLDivElement, {
    value: code.value,
    language: 'java',
    theme: 'vs-dark',
    fontSize: 18,
    lineNumbers: 'on',
    minimap: {
      enabled: false,
    },
  });
}

function runCode() {
  console.log('runCode');
  console.log(codeEditor.value.getValue());
}

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

<template>
  <div ref="editor_container" style="height: 1000px"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch } from 'vue';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
const props = defineProps<{
  editorValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:editorValue', value: string): void;
}>();

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === 'json') {
      return new jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

const editor_container = ref<HTMLDivElement | null>(null);

let editor: monaco.editor.IStandaloneCodeEditor;

onMounted(() => {
  editor = monaco.editor.create(editor_container.value!, {
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

  editor.onDidChangeModelContent((tt: any) => {
    emit('update:editorValue', editor.getValue());
  });
});

onUnmounted(() => {
  editor.dispose();
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

watch(
  () => props.editorValue,
  () => {
    editor.setValue(props.editorValue);
  }
);

const getV = () => {
  return editor.getValue();
};
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
</style>

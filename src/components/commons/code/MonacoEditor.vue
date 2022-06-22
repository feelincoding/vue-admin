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
import { defaultHanlderCode } from '@/views/main/code/DefaultHandlerCode';
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
    fontSize: 13,
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

const code = ref(defaultHanlderCode);

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

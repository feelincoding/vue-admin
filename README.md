# go-vue3

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### 라이브러리

- npm install vue-i18n@9

### 해결해야할 것들

- EventBus: @/plugins/modal/ModalEvent -> vue3에서는 mitt사용

Go vue3 정리

- 이득
  - Template 에서 script 단에서 작성한게 자동완성 된다.
    - -> 즉, 더욱 Type Safety된다.
  - vite를 사용해서 빌드할때 너무 빠르다 정말 너어어무
  - vue3에서는 레거시들을 미리 없앨 수 있다.
- 손해

  - 레거시인 것들을 지워내면 되는 것을 찾아야 하는데 이 과정이 순조로울지
    - Ex) Modal의 EventBus가 vue3에서는 legacy임-> mitt 라이브러리를 사용하여 해결해야함-> 이런 것들이 과연 얼마나 있을지?
  -

- 코드리뷰 할만한거
  - template
    - v-slot
      - v-slot:~
  - script
    - data 선언
      - const ~, ref, Ref, reactive
      - .value 로 접근
    - props
      - defineProps
    - emit
      - defineEmits
    - 함수 선언 방식
      - arrow function, const a = () => {}
  - route, router, b-~ tag, 빨간줄 이슈
  - import 할때 type 추가 여부

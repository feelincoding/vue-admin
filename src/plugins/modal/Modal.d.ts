import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    readonly $modal: GwModal;
  }
}

export interface GwModal {
  show: (message: string) => void;
  hide: () => void;
}

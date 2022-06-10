import type { InjectionKey } from 'vue';
export type ModalFunction = () => IModal;
export const modalInjectionKey: InjectionKey<ModalFunction> = Symbol('injectModal');
export interface IModal {
  show: (message: string) => void;
  hide: () => void;
}

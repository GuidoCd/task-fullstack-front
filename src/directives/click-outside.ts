// src/directives/click-outside.ts
import type { Directive, DirectiveBinding } from 'vue';

interface HTMLElementWithHandler extends HTMLElement {
  __ClickOutsideHandler__?: (event: MouseEvent) => void;
}

const clickOutside: Directive = {
  mounted(el: HTMLElementWithHandler, binding: DirectiveBinding) {
    el.__ClickOutsideHandler__ = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };
    document.body.addEventListener('click', el.__ClickOutsideHandler__);
  },
  unmounted(el: HTMLElementWithHandler) {
    if (el.__ClickOutsideHandler__) {
      document.body.removeEventListener('click', el.__ClickOutsideHandler__);
    }
  },
};

export default clickOutside;
import { Injectable } from "@angular/core";

export interface ToastInfo {
    header: string;
    body: string;
    delay?: number;
    link?: {
        url: string;
        label: string;
    }
  }
  
  @Injectable({ providedIn: 'root' })
  export class AppToastService {
    toasts: ToastInfo[] = [];
  
    show(options: ToastInfo) {
      this.toasts.push(options);
    }

    remove(toast: ToastInfo) {
        this.toasts.splice(this.toasts.indexOf(toast), 1);
    }
  }
import { Injectable } from '@angular/core';
declare var bootstrap: any;

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toastContainerId = 'toastContainer';

  constructor() {
    // Create toast container if not already present
    if (!document.getElementById(this.toastContainerId)) {
      const container = document.createElement('div');
      container.id = this.toastContainerId;
      container.className = 'toast-container position-fixed top-0 end-0 p-3';
      container.style.zIndex = '1100';
      document.body.appendChild(container);
    }
  }

  show(message: string) {
    const container = document.getElementById(this.toastContainerId);
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast align-items-center border-0';
    toast.role = 'alert';
    toast.ariaLive = 'assertive';
    toast.ariaAtomic = 'true';

    // ✅ Apply your custom colors here
    toast.style.backgroundColor = '#fae9ca';
    toast.style.color = '#FFA62F';
    toast.style.fontWeight = '500';
    toast.style.borderRadius = '10px';
    toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';

    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    container.appendChild(toast);

    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();

    toast.addEventListener('hidden.bs.toast', () => toast.remove());
  }


    showalert(message: string) {
    const container = document.getElementById(this.toastContainerId);
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast align-items-center border-0';
    toast.role = 'alert';
    toast.ariaLive = 'assertive';
    toast.ariaAtomic = 'true';

    // ✅ Apply your custom colors here
    toast.style.backgroundColor = '#dcddf8ff';
    toast.style.color = '#30336b';
    toast.style.fontWeight = '500';
    toast.style.borderRadius = '10px';
    toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';

    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    container.appendChild(toast);

    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();

    toast.addEventListener('hidden.bs.toast', () => toast.remove());
  }
}

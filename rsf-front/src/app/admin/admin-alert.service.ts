import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AdminAlertService {
  async confirm(options: {
    title: string;
    text: string;
    icon?: SweetAlertIcon;
    confirmText?: string;
    cancelText?: string;
  }) {
    const result = await Swal.fire({
      title: options.title,
      text: options.text,
      icon: options.icon ?? 'warning',
      showCancelButton: true,
      confirmButtonText: options.confirmText ?? 'Confirmer',
      cancelButtonText: options.cancelText ?? 'Annuler',
      reverseButtons: true,
      customClass: {
        confirmButton: 'swal2-confirm btn',
        cancelButton: 'swal2-cancel btn btn-ghost',
      },
      buttonsStyling: false,
    });

    return result.isConfirmed;
  }

  async success(title: string, text?: string) {
    await Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'swal2-confirm btn',
      },
      buttonsStyling: false,
    });
  }

  async error(title: string, text?: string) {
    await Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: 'Fermer',
      customClass: {
        confirmButton: 'swal2-confirm btn',
      },
      buttonsStyling: false,
    });
  }

  toastSuccess(title: string) {
    return this.toast('success', title);
  }

  toastError(title: string) {
    return this.toast('error', title);
  }

  private toast(icon: SweetAlertIcon, title: string) {
    return Swal.fire({
      toast: true,
      position: 'top-end',
      timer: 2600,
      timerProgressBar: true,
      showConfirmButton: false,
      icon,
      title,
    });
  }
}

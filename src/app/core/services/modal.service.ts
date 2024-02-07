import { Injectable } from '@angular/core';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modals: ModalComponent[] = [];

  add(modal: ModalComponent) {
    if (!modal.id || this.modals.find((x) => x.id === modal.id)) {
      throw new Error('Modal must have a unique id attribute');
    }

    this.modals.push(modal);
  }

  remove(modal: ModalComponent) {
    this.modals = this.modals.filter((x) => x === modal);
  }

  open(id: string) {
    const modal = this.modals.find((x) => x.id === id);

    if (!modal) {
      throw new Error(`Modal ${id} not found'`);
    }

    modal.open();
  }

  close() {
    const modal = this.modals.find((x) => x.isOpen);
    modal?.close();
  }
}

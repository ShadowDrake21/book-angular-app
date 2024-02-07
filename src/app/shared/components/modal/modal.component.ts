import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'popup-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  @Input() styles: string = 'min-h-full';
  isOpen = false;
  private element: any;

  constructor(private modalService: ModalService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    this.modalService.add(this);
    document.body.appendChild(this.element);

    this.element.addEventListener('click', (el: any) => {
      if (el.target.className === 'popup-modal') {
        this.close();
      }
    });
  }

  open() {
    this.element.style.display = 'block';
    document.body.classList.add('popup-modal__open');
    this.isOpen = true;
  }

  close() {
    this.element.style.display = 'none';
    document.body.classList.remove('popup-modal__open');
    this.isOpen = false;
  }

  ngOnDestroy(): void {
    this.modalService.remove(this);
    this.element.remove();
  }
}

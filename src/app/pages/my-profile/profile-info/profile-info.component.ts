import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { User } from '@angular/fire/auth';
import { TruncateTextPipe } from '../../../shared/pipes/truncate-text.pipe';
import { ModalService } from '../../../core/services/modal.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [CommonModule, TruncateTextPipe],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.scss',
})
export class ProfileInfoComponent implements OnInit, OnChanges {
  @Input() user!: User | null;
  @Output() openEditModal = new EventEmitter<boolean>();

  ngOnInit(): void {
    console.log('in profile-info', this.user);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.user = changes['user'].currentValue;
      console.log('in profile-info changes', this.user);
    }
  }
}

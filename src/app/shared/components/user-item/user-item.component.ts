import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IUser } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TruncateTextPipe } from '../../pipes/truncate-text.pipe';

@Component({
  selector: 'app-user-item',
  standalone: true,
  imports: [CommonModule, RouterModule, TruncateTextPipe],
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss',
})
export class UserItemComponent implements OnChanges {
  @Input({ required: true }) user!: IUser;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.user = changes['user'].currentValue;
    }
  }
}

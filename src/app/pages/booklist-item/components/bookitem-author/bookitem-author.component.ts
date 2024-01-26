import { Component, Input } from '@angular/core';
import { IAuthor } from '../../../../shared/models/author.model';
import { CommonModule } from '@angular/common';
import { AuthorImagePipe } from '../../../../shared/pipes/author-image.pipe';
import { TruncateTextPipe } from '../../../../shared/pipes/truncate-text.pipe';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bookitem-author',
  standalone: true,
  imports: [CommonModule, RouterModule, AuthorImagePipe, TruncateTextPipe],
  templateUrl: './bookitem-author.component.html',
  styleUrl: './bookitem-author.component.scss',
})
export class BookitemAuthorComponent {
  @Input() author!: IAuthor;
  @Input() authorKeys: string[] = [];
  @Input() index: number = 0;
  isString(value: any): boolean {
    return typeof value === 'string';
  }
}

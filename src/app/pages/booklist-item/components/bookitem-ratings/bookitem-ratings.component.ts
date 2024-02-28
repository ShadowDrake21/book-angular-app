import { Component, Input } from '@angular/core';
import { IBookExternalInfo } from '../../../../shared/models/book.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bookitem-ratings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookitem-ratings.component.html',
  styleUrl: './bookitem-ratings.component.scss',
})
export class BookitemRatingsComponent {
  @Input({ required: true }) ratingData!: IBookExternalInfo;
}

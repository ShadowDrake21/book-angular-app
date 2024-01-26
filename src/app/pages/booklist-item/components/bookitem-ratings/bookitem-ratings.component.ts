import { Component, Input, OnInit } from '@angular/core';
import { IBookExternalInfo } from '../../../../shared/models/book.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bookitem-ratings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookitem-ratings.component.html',
  styleUrl: './bookitem-ratings.component.scss',
})
export class BookitemRatingsComponent implements OnInit {
  @Input({ required: true }) ratingData!: IBookExternalInfo;

  ngOnInit(): void {
    console.log('rating: ', this.ratingData);
  }
}

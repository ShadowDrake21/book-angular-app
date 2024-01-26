import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IBook, IBookExternalInfo } from '../../models/book.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookImagePipe } from '../../pipes/book-image.pipe';

@Component({
  selector: 'app-book-item',
  standalone: true,
  imports: [CommonModule, RouterModule, BookImagePipe],
  templateUrl: './book-item.component.html',
  styleUrl: './book-item.component.scss',
})
export class BookItemComponent implements OnChanges {
  @Input({ required: true }) book!: IBook;
  keyCode!: string;

  bookExternalData!: IBookExternalInfo;
  bookExternalDataJustified!: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['book']) {
      this.keyCode = changes['book'].currentValue.key.slice(
        7,
        this.book.key.length
      );
      this.fillBookExternalData();
    }
  }

  fillBookExternalData(): void {
    this.bookExternalData = {
      number_of_pages_median: this.book.number_of_pages_median,
      ratings_average: this.book.ratings_average,
      ratings_count: this.book.ratings_count,
      ratings_count_1: this.book.ratings_count_1,
      ratings_count_2: this.book.ratings_count_2,
      ratings_count_3: this.book.ratings_count_3,
      ratings_count_4: this.book.ratings_count_4,
      ratings_count_5: this.book.ratings_count_5,
      want_to_read_count: this.book.want_to_read_count,
      currently_reading_count: this.book.currently_reading_count,
      already_read_count: this.book.already_read_count,
    };

    this.bookExternalDataJustified = JSON.stringify(this.bookExternalData);
  }
}

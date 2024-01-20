import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IBook } from '../../models/book.model';
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['book']) {
      this.keyCode = changes['book'].currentValue.key.slice(
        7,
        this.book.key.length
      );
    }
  }
}

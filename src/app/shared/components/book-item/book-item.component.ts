import { Component, Input } from '@angular/core';
import { Book } from '../../models/book.model';
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
export class BookItemComponent {
  @Input({ required: true }) book!: Book;
}

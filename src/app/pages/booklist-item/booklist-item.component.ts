import { Component, OnInit, inject } from '@angular/core';
import { BooksService } from '../../core/services/books.service';

@Component({
  selector: 'app-booklist-item',
  standalone: true,
  imports: [],
  templateUrl: './booklist-item.component.html',
  styleUrl: './booklist-item.component.scss',
})
export class BooklistItemComponent implements OnInit {
  booksService = inject(BooksService);
  ngOnInit(): void {}
}

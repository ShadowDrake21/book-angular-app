import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { IBook } from '../../models/book.model';
import { BookItemComponent } from '../book-item/book-item.component';

@Component({
  selector: 'app-booklist-catalogue',
  standalone: true,
  imports: [BookItemComponent],
  templateUrl: './booklist-catalogue.component.html',
  styleUrl: './booklist-catalogue.component.scss',
})
export class BooklistCatalogueComponent implements OnInit, OnChanges {
  @Input({ required: true }) books: IBook[] = [];
  @Input() itemsPerPage: number = 8;
  @Output() linkUsed = new EventEmitter<boolean>();
  currentPage: number = 1;
  visibleBooks: IBook[] = [];
  ngOnInit(): void {
    console.log('old', this.books);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['books']) {
      this.books = changes['books'].currentValue;
      this.currentPage = 1;
      this.updateVisibleBooks();
    }
  }
  updateVisibleBooks() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.visibleBooks = this.books.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.numPages()) {
      this.currentPage++;
      this.updateVisibleBooks();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateVisibleBooks();
    }
  }

  numPages(): number {
    return Math.ceil(this.books.length / this.itemsPerPage);
  }
}

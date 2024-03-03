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
import { IBook } from '../../models/book.model';
import { BookItemComponent } from '../book-item/book-item.component';
import { PaginationLiteService } from '../../../core/services/pagination-lite.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booklist-catalogue',
  standalone: true,
  imports: [CommonModule, BookItemComponent],
  providers: [PaginationLiteService],
  templateUrl: './booklist-catalogue.component.html',
  styleUrl: './booklist-catalogue.component.scss',
})
export class BooklistCatalogueComponent implements OnChanges {
  protected paginationLiteService = inject(PaginationLiteService);

  @Input({ required: true }) books: IBook[] = [];
  @Input() itemsPerPage: number = 8;
  @Output() linkUsed = new EventEmitter<boolean>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['books']) {
      this.books = changes['books'].currentValue;
      this.paginationLiteService.currentPage = 1;
      this.paginationLiteService.itemsPerPage = this.itemsPerPage;
      this.paginationLiteService.elements = this.books;
      this.paginationLiteService.updateVisibleElements();
    }
  }
}

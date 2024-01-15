import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IBook } from '../../../../shared/models/book.model';
import { BookItemComponent } from '../../../../shared/components/book-item/book-item.component';

@Component({
  selector: 'app-booklist-catalogue',
  standalone: true,
  imports: [BookItemComponent],
  templateUrl: './booklist-catalogue.component.html',
  styleUrl: './booklist-catalogue.component.scss',
})
export class BooklistCatalogueComponent implements OnInit, OnChanges {
  @Input({ required: true }) books: IBook[] = [];
  ngOnInit(): void {
    console.log('old', this.books);
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.books = changes['books'].currentValue;
    console.log('new arr', this.books);
  }
}

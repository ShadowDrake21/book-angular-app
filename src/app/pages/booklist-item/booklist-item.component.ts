import { Component, OnInit, inject } from '@angular/core';
import { BooksService } from '../../core/services/books.service';
import { ActivatedRoute } from '@angular/router';
import { IWork } from '../../shared/models/book.model';

@Component({
  selector: 'app-booklist-item',
  standalone: true,
  imports: [],
  templateUrl: './booklist-item.component.html',
  styleUrl: './booklist-item.component.scss',
})
export class BooklistItemComponent implements OnInit {
  booksService = inject(BooksService);
  route = inject(ActivatedRoute);

  path!: string;
  book!: IWork;
  ngOnInit(): void {
    this.path = this.route.snapshot.url[1].path;

    this.booksService.getWorkByKey(this.path).subscribe((res) => {
      this.book = res;
      console.log(this.book);
    });
  }
}

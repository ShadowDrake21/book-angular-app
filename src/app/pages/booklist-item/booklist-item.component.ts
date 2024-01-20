import { Component, OnInit, inject } from '@angular/core';
import { BooksService } from '../../core/services/books.service';
import { ActivatedRoute } from '@angular/router';
import { IWork } from '../../shared/models/book.model';
import { BookImagePipe } from '../../shared/pipes/book-image.pipe';

@Component({
  selector: 'app-booklist-item',
  standalone: true,
  imports: [BookImagePipe],
  templateUrl: './booklist-item.component.html',
  styleUrl: './booklist-item.component.scss',
})
export class BooklistItemComponent implements OnInit {
  booksService = inject(BooksService);
  route = inject(ActivatedRoute);

  path!: string;
  book!: IWork;

  mainCover!: string;
  ngOnInit(): void {
    this.path = this.route.snapshot.url[1].path;

    this.booksService.getWorkByKey(this.path).subscribe((res) => {
      this.book = res;
      this.mainCover = this.book.covers[0].toString();
      console.log(this.book);
    });
  }
}

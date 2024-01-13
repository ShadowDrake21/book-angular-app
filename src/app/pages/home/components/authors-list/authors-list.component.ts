import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BooksService } from '../../../../core/services/books.service';
import { Author } from '../../../../shared/models/author.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-authors-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './authors-list.component.html',
  styleUrl: './authors-list.component.scss',
})
export class AuthorsListComponent implements OnInit {
  bookService = inject(BooksService);

  numFound!: number;
  authorsList: Author[] = [];
  loadingAuthors?: boolean;

  async ngOnInit() {
    this.loadingAuthors = true;

    await new Promise((resolve) => setTimeout(resolve, 2000));
    this.bookService
      .getAuthorsByName('Bronte', 20)
      .subscribe(({ numFound, docs }) => {
        this.numFound = numFound;
        this.authorsList = docs;
        console.log(this.authorsList);
        this.loadingAuthors = false;
      });
  }
}

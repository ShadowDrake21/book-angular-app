import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BooksService } from '../../../../core/services/books.service';
import { Author } from '../../../../shared/models/author.model';
import { RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../../../shared/components/UI/input/input.component';
import { ButtonComponent } from '../../../../shared/components/UI/button/button.component';

@Component({
  selector: 'app-authors-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './authors-list.component.html',
  styleUrl: './authors-list.component.scss',
})
export class AuthorsListComponent implements OnInit {
  bookService = inject(BooksService);

  searchAuthorForm = new FormGroup({
    authorName: new FormControl(''),
  });

  numFound!: number;
  authorsList: Author[] = [];
  loadingAuthors?: boolean;

  async ngOnInit() {
    this.loadingAuthors = true;

    await new Promise((resolve) => setTimeout(resolve, 3000));
    this.bookService
      .getAuthorsByName('Bronte', 20)
      .subscribe(({ numFound, docs }) => {
        this.numFound = numFound;
        this.authorsList = docs;
        console.log(this.authorsList);
        this.loadingAuthors = false;
      });
  }

  onSearch() {
    console.log(this.searchAuthorForm.value.authorName);
    if (!this.searchAuthorForm.value.authorName) {
      return;
    }
    this.bookService
      .getAuthorsByName(this.searchAuthorForm.value.authorName, 20)
      .subscribe(({ numFound, docs }) => {
        this.numFound = numFound;
        this.authorsList = docs;
      });
  }
}

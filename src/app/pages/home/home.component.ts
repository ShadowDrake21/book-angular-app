import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/authentication/auth.service';
import { InputComponent } from '../../shared/components/UI/input/input.component';
import { ButtonComponent } from '../../shared/components/UI/button/button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BooksService } from '../../core/services/books.service';
import { IBook } from '../../shared/models/book.model';
import { BookItemComponent } from '../../shared/components/book-item/book-item.component';
import { CarouselComponent } from '../../shared/components/carousel/carousel.component';
import { AuthorsListComponent } from './components/authors-list/authors-list.component';
import { AboutUserComponent } from './components/about-user/about-user.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    RouterModule,
    BookItemComponent,
    CarouselComponent,
    AuthorsListComponent,
    AboutUserComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private booksService = inject(BooksService);

  booksFantasy: IBook[] = [];
  loadingFantasy?: boolean;

  booksSport: IBook[] = [];
  loadingSport?: boolean;

  booksLove: IBook[] = [];
  loadingLove?: boolean;

  booksChildren: IBook[] = [];
  loadingChildren?: boolean;

  async ngOnInit() {
    this.loadingFantasy = true;
    this.loadingSport = true;
    this.loadingLove = true;
    this.loadingChildren = true;

    await new Promise((resolve) => setTimeout(resolve, 2000));
    this.getFantasyBooks();
    this.getAdventuresBooks();
    this.getLoveBooks();
    this.getChildrenBooks();
  }

  getFantasyBooks() {
    this.booksService
      .getBooksBySubject('fantasy', {
        details: true,
        limit: 10,
        lang: 'en',
        sort: 'new',
      })
      .subscribe((res) => {
        this.booksFantasy = res.works;
        this.loadingFantasy = false;
      });
  }

  getAdventuresBooks() {
    this.booksService
      .getBooksBySubject('adventures', {
        details: true,
        limit: 10,
        lang: 'en',
        sort: 'new',
      })
      .subscribe((res) => {
        this.booksSport = res.works;
        this.loadingSport = false;
      });
  }

  getLoveBooks() {
    this.booksService
      .getBooksBySubject('love', {
        details: true,
        limit: 10,
        lang: 'en',
        sort: 'new',
      })
      .subscribe((res) => {
        this.booksLove = res.works;
        this.loadingLove = false;
      });
  }

  getChildrenBooks() {
    this.booksService
      .getBooksBySubject('children', {
        details: true,
        limit: 10,
        lang: 'en',
      })
      .subscribe((res) => {
        this.booksChildren = res.works;
        this.loadingChildren = false;
      });
  }
}

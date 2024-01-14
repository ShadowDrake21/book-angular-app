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
  authService = inject(AuthService);
  router = inject(Router);
  booksService = inject(BooksService);

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
    this.booksService
      .getBooksBySubject('fantasy', {
        details: true,
        limit: 10,
        lang: 'en',
        sort: 'new',
      })
      .subscribe((res) => {
        this.booksFantasy = res.works;
        console.log(this.booksFantasy);
        this.loadingFantasy = false;
      });

    this.booksService
      .getBooksBySubject('adventures', {
        details: true,
        limit: 10,
        lang: 'en',
        sort: 'new',
      })
      .subscribe((res) => {
        this.booksSport = res.works;
        console.log(this.booksSport);
        this.loadingSport = false;
      });

    this.booksService
      .getBooksBySubject('love', {
        details: true,
        limit: 10,
        lang: 'en',
        sort: 'new',
      })
      .subscribe((res) => {
        this.booksLove = res.works;
        console.log(this.booksSport);
        this.loadingLove = false;
      });

    this.booksService
      .getBooksBySubject('children', {
        details: true,
        limit: 10,
        lang: 'en',
      })
      .subscribe((res) => {
        this.booksChildren = res.works;
        console.log(this.booksChildren);
        this.loadingChildren = false;
      });
  }

  onLogout() {
    this.authService
      .logout()
      .then(() => {
        console.log('user is logged out');
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  isLogin = setInterval(() => {
    this.authService.authState$.subscribe((res) => {
      if (res && res.uid) {
        console.log('user is logged in');
      } else {
        console.log('user is not logged in');
      }
    });
  }, 2000);
}

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/authentication/auth.service';
import { InputComponent } from '../../shared/components/UI/input/input.component';
import { ButtonComponent } from '../../shared/components/UI/button/button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BooksService } from '../../core/services/books.service';
import { Book } from '../../shared/models/book.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  booksService = inject(BooksService);

  books: Array<Book> = [];

  ngOnInit(): void {
    this.booksService.getBooks('Ania z Zielonego Wzgórza').subscribe((res) => {
      this.books = res.items;
      console.log(this.books);
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

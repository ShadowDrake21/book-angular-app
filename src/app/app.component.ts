import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ModalService } from './core/services/modal.service';
import { BooksService } from './core/services/books.service';
import { IBook } from './shared/models/book.model';
import { BooklistCatalogueComponent } from './shared/components/booklist-catalogue/booklist-catalogue.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ModalComponent,
    BooklistCatalogueComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private booksService = inject(BooksService);
  protected modalService = inject(ModalService);

  isUnnavPage: boolean = false;
  searchTerm!: string;
  loadingFoundBooks!: boolean;
  foundBooks: IBook[] = [];
  visibleBooks: IBook[] = [];

  searchLimitsForm = new FormGroup({
    limit: new FormControl('20'),
  });

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isUnnavPage =
          event.url === '/' ||
          event.url === '/login' ||
          event.url === '/login/reset-password' ||
          event.url === '/registration';
      } else if (!(event instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  getSearchTerm(value: string) {
    this.searchTerm = value;
    this.getBooksByTitle(this.searchTerm);
    this.modalService.open('search-by-title');
  }

  getBooksByTitle(searchTerm: string) {
    this.loadingFoundBooks = true;
    this.booksService
      .getBooksByTitle(searchTerm, { limit: 100 })
      .subscribe((res) => {
        this.foundBooks = res.docs;
        this.setVisibleBooks();
        this.loadingFoundBooks = false;
      });
  }

  setVisibleBooks() {
    if (!this.searchLimitsForm.value.limit) return;
    this.visibleBooks = this.foundBooks.slice(
      0,
      parseInt(this.searchLimitsForm.value.limit)
    );
  }
}

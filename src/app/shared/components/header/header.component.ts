import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { SearchInputComponent } from '../search-input/search-input.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/authentication/auth.service';
import { User } from '@angular/fire/auth';
import { TruncateTextPipe } from '../../pipes/truncate-text.pipe';
import { ProfileDropdownComponent } from './components/profile-dropdown/profile-dropdown.component';
import { NotificationsDropdownComponent } from './components/notifications-dropdown/notifications-dropdown.component';
import { ModalComponent } from '../modal/modal.component';
import { ModalService } from '../../../services/modal.service';
import { BooksService } from '../../../core/services/books.service';
import { BooklistCatalogueComponent } from '../booklist-catalogue/booklist-catalogue.component';
import { IBook } from '../../models/book.model';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    SearchInputComponent,
    TruncateTextPipe,
    ClickOutsideDirective,
    ProfileDropdownComponent,
    NotificationsDropdownComponent,
    ModalComponent,
    BooklistCatalogueComponent,
  ],
})
export class HeaderComponent {
  faEnvelope = faEnvelope;

  public user!: User | null;
  public userEmail: string = '';

  searchTerm!: string;
  loadingFoundBooks!: boolean;
  foundBooks: IBook[] = [];

  constructor(
    private authService: AuthService,
    private booksService: BooksService,
    protected modalService: ModalService
  ) {
    this.authService.user$.subscribe((res) => {
      this.user = res;
      if (this.user?.email) {
        this.userEmail = this.user.email;
      }
    });
  }

  clickedLi: string = 'background-color: rgb(122, 122, 122); color: #fff;';

  getSearchTerm(value: string) {
    this.searchTerm = value;
    this.loadingFoundBooks = true;
    this.getBooksByTitle(this.searchTerm);
    this.modalService.open('search-by-title');
  }

  getBooksByTitle(searchTerm: string) {
    this.booksService.getBooksByTitle(searchTerm).subscribe((res) => {
      this.foundBooks = res.docs;
      this.loadingFoundBooks = false;
    });
  }
}

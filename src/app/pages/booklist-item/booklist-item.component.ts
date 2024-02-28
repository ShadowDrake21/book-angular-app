import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BooksService } from '../../core/services/books.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IBookExternalInfo, IWork } from '../../shared/models/book.model';
import { BookImagePipe } from '../../shared/pipes/book-image.pipe';
import { CommonModule } from '@angular/common';
import { TruncateTextPipe } from '../../shared/pipes/truncate-text.pipe';
import { ObjectManipulations } from '../../shared/utils/objectManipulations.utils';
import { IAuthor } from '../../shared/models/author.model';
import { AuthorImagePipe } from '../../shared/pipes/author-image.pipe';
import { ButtonComponent } from '../../shared/components/UI/button/button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StarRatingModule } from 'angular-star-rating';
import { AuthService } from '../../core/authentication/auth.service';
import { INeededUserInfo } from '../../shared/models/comment.model';
import { Subscription } from 'rxjs';
import { BookmarkButtonComponent } from '../../shared/components/bookmark-button/bookmark-button.component';
import { BookmarkService } from '../../core/services/bookmark.service';
import { ItemScrollListComponent } from '../../shared/components/item-scroll-list/item-scroll-list.component';
import { IItemScrollList } from '../../shared/models/itemScrollList.model';
import { BookitemRatingsComponent } from './components/bookitem-ratings/bookitem-ratings.component';
import { BookitemAuthorComponent } from './components/bookitem-author/bookitem-author.component';
import { BookitemCommentsSectionComponent } from './components/bookitem-comments-section/bookitem-comments-section.component';
import { AuthorsService } from '../../core/services/authors.service';

@Component({
  selector: 'app-booklist-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BookImagePipe,
    AuthorImagePipe,
    TruncateTextPipe,
    ButtonComponent,
    ReactiveFormsModule,
    StarRatingModule,
    BookmarkButtonComponent,
    ItemScrollListComponent,
    BookitemRatingsComponent,
    BookitemAuthorComponent,
    BookitemCommentsSectionComponent,
  ],
  templateUrl: './booklist-item.component.html',
  styleUrl: './booklist-item.component.scss',
})
export class BooklistItemComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  booksService = inject(BooksService);
  authorsService = inject(AuthorsService);
  bookmarkService = inject(BookmarkService);

  private subscription!: Subscription;
  neededUserInfo: INeededUserInfo = { email: '' };
  isUserHasComment: boolean = false;

  bookId!: string;
  bookExternalData!: IBookExternalInfo;
  loadingBook?: boolean;

  book!: IWork;
  mainCover!: string;

  descriptionBtn: string = 'Show more';
  descriptionShowLength: number = 300;
  isDescriptionFullText: boolean = false;

  charactersListObject!: IItemScrollList;
  placesListObject!: IItemScrollList;
  subjectsListObject!: IItemScrollList;

  authors: IAuthor[] = [];
  authorKeys: string[] = [];
  loadingAuthor?: boolean;

  isBookmarked: boolean = false;

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe(async (data) => {
      if (!data?.email || !data.photoURL) return;
      this.neededUserInfo.email = data?.email;
      this.bookmarkService
        .checkUserHasBookmark(this.neededUserInfo.email, 'books', this.bookId)
        .then((res: boolean) => {
          this.isBookmarked = res;
        });
    });

    const externalDataParams =
      this.route.snapshot.queryParamMap.get('externalData');

    if (externalDataParams !== null) {
      this.bookExternalData = JSON.parse(externalDataParams);
    }
    this.bookId = this.route.snapshot.url[1].path;
    this.loadWork();
  }

  loadWork() {
    this.loadingBook = true;
    this.booksService.getWorkByKey(this.bookId).subscribe((res) => {
      this.book = res;
      this.mainCover = this.book.covers && this.book.covers[0].toString();
      this.charactersListObject = ObjectManipulations.constructListObject(
        ObjectManipulations.checkIfHasKey(this.book, 'subject_people')
          ? this.book.subject_people
          : [],
        false,
        'Show all characters'
      );
      this.placesListObject = ObjectManipulations.constructListObject(
        ObjectManipulations.checkIfHasKey(this.book, 'subject_places')
          ? this.book.subject_places
          : [],
        false,
        'Show all places'
      );
      this.subjectsListObject = ObjectManipulations.constructListObject(
        ObjectManipulations.checkIfHasKey(this.book, 'subjects')
          ? this.book.subjects
          : [],
        true,
        'Show all subjects'
      );
      this.loadingAuthor = true;
      this.getAuthors();
      this.loadingBook = false;
    });
  }

  showCloseDescription() {
    let descriptionLength = this.book.description.value
      ? this.book.description.value.length
      : this.book.description.toString().length;
    if (this.descriptionBtn === 'Show more') {
      this.descriptionBtn = 'Hide';
      this.descriptionShowLength = descriptionLength;
      this.isDescriptionFullText = true;
    } else {
      this.descriptionBtn = 'Show more';
      this.descriptionShowLength = 300;
      this.isDescriptionFullText = false;
    }
  }

  getAuthors() {
    for (const author of this.book.authors) {
      let authorKey = author.author.key.slice(9, author.author.key.length);
      this.authorKeys.push(authorKey);
      this.authorsService.getAuthorByKey(authorKey).subscribe((res) => {
        this.authors.push(res);
      });
    }
    this.loadingAuthor = false;
  }

  getBookmarkedChange(bookmarkedChange: boolean) {
    this.isBookmarked = bookmarkedChange;

    if (this.isBookmarked) {
      this.addBookmark();
    } else {
      this.deleteBookmark();
    }
  }

  addBookmark() {
    this.bookmarkService
      .addNewBookmark(this.neededUserInfo.email, 'books', this.bookId)
      .then(() => {});
  }

  deleteBookmark() {
    this.bookmarkService
      .deleteBookmark(this.neededUserInfo.email, 'books', this.bookId)
      .then(() => {});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

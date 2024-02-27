import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AuthorsService } from '../../core/services/authors.service';
import { ActivatedRoute } from '@angular/router';
import { IAuthor, IRemoteIdsLinks } from '../../shared/models/author.model';
import { CommonModule } from '@angular/common';
import { AuthorImagePipe } from '../../shared/pipes/author-image.pipe';
import { remoteIdsServices } from './content/authorlist-item.content';
import { TruncateTextPipe } from '../../shared/pipes/truncate-text.pipe';
import { ItemScrollListComponent } from '../../shared/components/item-scroll-list/item-scroll-list.component';
import { IItemScrollList } from '../../shared/models/itemScrollList.model';
import { ObjectManipulations } from '../../shared/utils/objectManipulations.utils';
import { CarouselComponent } from '../../shared/components/carousel/carousel.component';
import { IBook } from '../../shared/models/book.model';
import { BooksService } from '../../core/services/books.service';
import { AuthoritemCommentsSectionComponent } from './authoritem-comments-section/authoritem-comments-section.component';
import { BookmarkService } from '../../core/services/bookmark.service';
import { Subscription, switchMap } from 'rxjs';
import { INeededUserInfo } from '../../shared/models/comment.model';
import { AuthService } from '../../core/authentication/auth.service';
import { BookmarkButtonComponent } from '../../shared/components/bookmark-button/bookmark-button.component';

@Component({
  selector: 'app-authorlist-item',
  standalone: true,
  templateUrl: './authorlist-item.component.html',
  styleUrl: './authorlist-item.component.scss',
  imports: [
    CommonModule,
    AuthorImagePipe,
    TruncateTextPipe,
    ItemScrollListComponent,
    CarouselComponent,
    AuthoritemCommentsSectionComponent,
    BookmarkButtonComponent,
  ],
})
export class AuthorlistItemComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  authorsService = inject(AuthorsService);
  booksService = inject(BooksService);
  bookmarkService = inject(BookmarkService);

  private subscription!: Subscription;
  neededUserInfo: INeededUserInfo = { email: '' };
  isUserHasComment: boolean = false;
  loadingAuthor!: boolean;

  authorId!: string;
  author!: IAuthor;
  mainPhoto!: string;
  authorBio: string = '';
  alternateNamesListObject!: IItemScrollList;
  soutceRecordsListObject!: IItemScrollList;

  authorBooks: IBook[] = [];
  loadingBooks?: boolean;

  fullRemoteIdsLinks!: IRemoteIdsLinks[] | null;

  bioBtn: string = 'Show more';
  bioShowLength: number = 300;
  isBioFullText: boolean = false;

  isBookmarked: boolean = false;

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe(async (data) => {
      if (!data?.email || !data.photoURL) return;
      this.neededUserInfo.email = data?.email;
      this.bookmarkService
        .checkUserHasBookmark(
          this.neededUserInfo.email,
          'authors',
          this.authorId
        )
        .then((res: boolean) => {
          this.isBookmarked = res;
        });
    });

    this.authorId = this.route.snapshot.url[1].path;

    this.loadAuthorDetails();
  }

  loadAuthorDetails(): void {
    this.loadingAuthor = true;
    this.loadingBooks = true;
    this.authorsService.getAuthorByKey(this.authorId).subscribe((res) => {
      this.author = res;
      this.mainPhoto = this.author.photos && this.author.photos[0].toString();
      this.formateRemoteIds();
      if (this.author.bio) {
        this.authorBio = this.author.bio || '';
      } else {
        this.authorBio = '';
      }
      this.alternateNamesListObject = ObjectManipulations.constructListObject(
        ObjectManipulations.checkIfHasKey(this.author, 'alternate_names')
          ? this.author.alternate_names
          : [],
        false,
        'Show all names'
      );
      this.soutceRecordsListObject = ObjectManipulations.constructListObject(
        ObjectManipulations.checkIfHasKey(this.author, 'source_records')
          ? this.author.source_records
          : [],
        false,
        'Show all records'
      );
      this.booksService.getBooksByAuthor(this.authorId, 20).subscribe((res) => {
        this.authorBooks = res.docs;
        this.loadingBooks = false;
      });
      this.loadingAuthor = false;
    });
  }

  formateRemoteIds() {
    if (!this.author.remote_ids) {
      this.fullRemoteIdsLinks = null;
      return;
    }

    let remoteIdsKeys: Array<string> = Object.keys(this.author.remote_ids);
    remoteIdsKeys = remoteIdsKeys.filter(
      (id) => id !== 'amazon' && id !== 'isni'
    );

    this.fullRemoteIdsLinks = [];

    this.fullRemoteIdsLinks = remoteIdsKeys.map((key) => {
      const value = this.author.remote_ids[key];
      return {
        text: key,
        link: `${remoteIdsServices[key]}${value}`,
      };
    });
  }

  showCloseBio() {
    if (!this.author.bio) {
      return;
    }
    let bioLength = this.author.bio.length;
    if (this.bioBtn === 'Show more') {
      this.bioBtn = 'Hide';
      this.bioShowLength = bioLength;
      this.isBioFullText = true;
    } else {
      this.bioBtn = 'Show more';
      this.bioShowLength = 300;
      this.isBioFullText = false;
    }
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
    this.bookmarkService.addNewBookmark(
      this.neededUserInfo.email,
      'authors',
      this.authorId
    );
  }

  deleteBookmark() {
    this.bookmarkService.deleteBookmark(
      this.neededUserInfo.email,
      'authors',
      this.authorId
    );
  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

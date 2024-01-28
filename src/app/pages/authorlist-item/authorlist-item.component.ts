import { Component, OnInit, inject } from '@angular/core';
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
  ],
})
export class AuthorlistItemComponent implements OnInit {
  route = inject(ActivatedRoute);
  authorsService = inject(AuthorsService);
  booksService = inject(BooksService);

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

  ngOnInit(): void {
    this.authorId = this.route.snapshot.url[1].path;
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
      console.log(this.author);
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

    for (let remoteId = 0; remoteId < remoteIdsKeys.length; remoteId++) {
      const key = remoteIdsKeys[remoteId];
      const value = this.author.remote_ids[key];

      const remoteIdsLink: IRemoteIdsLinks = {
        text: key,
        link: `${remoteIdsServices[key]}${value}`,
      };
      this.fullRemoteIdsLinks.push(remoteIdsLink);
    }
  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }
}

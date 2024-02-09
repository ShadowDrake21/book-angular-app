import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { UseritemBookmarksComponent } from '../../../useritem-bookmarks/useritem-bookmarks.component';
import { AuthorsService } from '../../../../../core/services/authors.service';
import { BookmarkService } from '../../../../../core/services/bookmark.service';
import { IAuthor } from '../../../../models/author.model';
import { forkJoin } from 'rxjs';
import { FavouriteAuthorsService } from '../../../../../core/services/favourite-authors.service';

@Component({
  selector: 'app-useritem-prebookmarks-authors',
  standalone: true,
  imports: [CommonModule, UseritemBookmarksComponent],
  providers: [FavouriteAuthorsService],
  templateUrl: './useritem-prebookmarks-authors.component.html',
  styleUrl: './useritem-prebookmarks-authors.component.scss',
})
export class UseritemPrebookmarksAuthorsComponent implements OnInit {
  protected favouriteAuthorsService = inject(FavouriteAuthorsService);

  @Input({ required: true }) email: string | null | undefined = '';
  @Output() countAuthors = new EventEmitter<number>();

  async ngOnInit(): Promise<void> {
    this.favouriteAuthorsService.userEmail = this.email;
    await this.favouriteAuthorsService.loadingItems().then(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      this.favouriteAuthorsService.loadingAuthors = false;
      console.log(this.favouriteAuthorsService.userAuthors);
    });

    this.countAuthors.emit(
      this.favouriteAuthorsService.userAuthorBookmarks.length
    );
  }
}

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
    await this.favouriteAuthorsService.loadingItems();

    this.countAuthors.emit(
      this.favouriteAuthorsService.userAuthorBookmarks.length
    );
  }
}

import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { AuthorItemComponent } from '../../../../shared/components/author-item/author-item.component';
import { CommonModule } from '@angular/common';
import { AuthorsService } from '../../../../core/services/authors.service';
import { BookmarkService } from '../../../../core/services/bookmark.service';
import { User } from '@angular/fire/auth';
import { IAuthor } from '../../../../shared/models/author.model';
import { forkJoin } from 'rxjs';
import { FavouriteAuthorsService } from '../../../../core/services/favourite-authors.service';

@Component({
  selector: 'app-profile-authors',
  standalone: true,
  imports: [CommonModule, AuthorItemComponent],
  providers: [FavouriteAuthorsService],
  templateUrl: './profile-authors.component.html',
  styleUrl: './profile-authors.component.scss',
})
export class ProfileAuthorsComponent implements OnInit {
  protected favouriteAuthorsService = inject(FavouriteAuthorsService);

  @Input({ required: true }) user!: User | null;

  visibleAuthors: IAuthor[] = [];

  async ngOnInit(): Promise<void> {
    this.favouriteAuthorsService.userEmail = this.user?.email;
    await this.favouriteAuthorsService.loadingItems().then(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      this.favouriteAuthorsService.loadingAuthors = false;
      this.visibleAuthors = this.favouriteAuthorsService.userAuthors.slice(
        0,
        5
      );
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthorImagePipe } from '../../pipes/author-image.pipe';
import { IAuthor, IAuthorSearch } from '../../models/author.model';
import { AuthorsService } from '../../../core/services/authors.service';

@Component({
  selector: 'app-author-item',
  standalone: true,
  imports: [CommonModule, RouterModule, AuthorImagePipe],
  templateUrl: './author-item.component.html',
  styleUrl: './author-item.component.scss',
})
export class AuthorItemComponent implements OnInit {
  authorsService = inject(AuthorsService);
  @Input() author!: IAuthorSearch | IAuthor;

  photoId: string = '';
  loadingPhoto?: boolean;

  ngOnInit(): void {
    this.loadingPhoto = true;
    this.getPhoto();
  }

  getPhoto() {
    this.authorsService
      .getAuthorByKey(this.author.key)
      .subscribe((res: IAuthor) => {
        this.photoId = res.photos ? res.photos[0].toString() : 'no photo';
        this.loadingPhoto = false;
      });
  }
}

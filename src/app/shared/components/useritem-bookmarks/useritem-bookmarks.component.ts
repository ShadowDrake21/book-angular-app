import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IWork } from '../../models/book.model';
import { IAuthor } from '../../models/author.model';
import { WorkItemComponent } from '../work-item/work-item.component';
import { AuthorItemComponent } from '../author-item/author-item.component';
import { PaginationLiteService } from '../../../core/services/pagination-lite.service';

@Component({
  selector: 'app-userlist-item-bookmarks',
  standalone: true,
  imports: [CommonModule, RouterModule, WorkItemComponent, AuthorItemComponent],
  providers: [PaginationLiteService],
  templateUrl: './useritem-bookmarks.component.html',
  styleUrl: './useritem-bookmarks.component.scss',
})
export class UseritemBookmarksComponent implements OnInit, OnChanges {
  protected paginationLiteService = inject(PaginationLiteService);
  private route = inject(ActivatedRoute);

  @Input() entity: 'works' | 'authors' = 'works';
  @Input() works: IWork[] = [];
  @Input() authors: IAuthor[] = [];

  ngOnInit(): void {
    this.paginationLiteService.itemsPerPage = 4;
    this.paginationUsage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['works']) {
      this.works = changes['works'].currentValue;
    }
    if (changes['authors']) {
      this.authors = changes['authors'].currentValue;
    }
    this.paginationLiteService.currentPage = 1;
    this.paginationUsage();
  }

  paginationUsage() {
    if (this.entity === 'works') {
      this.paginationLiteService.elements = this.works;
    } else {
      this.paginationLiteService.elements = this.authors;
    }
    this.paginationLiteService.updateVisibleElements();
  }
}

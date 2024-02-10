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

@Component({
  selector: 'app-userlist-item-bookmarks',
  standalone: true,
  imports: [CommonModule, RouterModule, WorkItemComponent, AuthorItemComponent],
  templateUrl: './useritem-bookmarks.component.html',
  styleUrl: './useritem-bookmarks.component.scss',
})
export class UseritemBookmarksComponent implements OnInit, OnChanges {
  route = inject(ActivatedRoute);

  @Input() entity: 'works' | 'authors' = 'works';
  @Input() works: IWork[] = [];
  @Input() authors: IAuthor[] = [];

  itemsPerPage: number = 4;
  currentPage: number = 1;

  visibleWorks: IWork[] = [];
  visibleAuthors: IAuthor[] = [];

  ngOnInit(): void {
    this.updateVisible();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['works']) {
      this.works = changes['works'].currentValue;
    }
    if (changes['authors']) {
      this.authors = changes['authors'].currentValue;
    }
    this.currentPage = 1;
    this.updateVisible();
  }

  updateVisible() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    if (this.entity === 'works') {
      this.visibleWorks = this.works.slice(startIndex, endIndex);
    } else {
      this.visibleAuthors = this.authors.slice(startIndex, endIndex);
    }
  }

  nextPage() {
    if (this.currentPage < this.numPages()) {
      this.currentPage++;
      this.updateVisible();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateVisible();
    }
  }

  numPages(): number {
    if (this.entity === 'works') {
      return Math.ceil(this.works.length / this.itemsPerPage);
    } else {
      return Math.ceil(this.authors.length / this.itemsPerPage);
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  itemsPerPage!: number;
  currentPage$ = new BehaviorSubject(1);

  currentPageData$!: Observable<any>;
  isLastPage: boolean = false;
  isFirstPage: boolean = false;
  constructor() {}

  public setItemsPerPage(value: number) {
    this.itemsPerPage = value;
  }

  calcNumPages(itemsNum: number): number {
    let pages = Math.ceil(itemsNum / this.itemsPerPage);
    return pages;
  }

  checkLastPage(itemsNum: number) {
    const totalPages = this.calcNumPages(itemsNum);
    this.isLastPage = this.currentPage$.value === totalPages;
  }

  setIfLastPage(itemsNum: number) {
    if (this.calcNumPages(itemsNum) === this.currentPage$.value) {
      this.isLastPage = true;
    }
  }

  checkFirstPage() {
    this.isFirstPage = this.currentPage$.value === 1;
  }

  nextPage() {
    this.currentPage$.next(this.currentPage$.value + 1);
  }

  prevPage() {
    this.currentPage$.next(this.currentPage$.value - 1);
  }

  goToFirst() {
    this.currentPage$.next(1);
  }
}

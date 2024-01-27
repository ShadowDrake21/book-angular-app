import { Injectable, inject } from '@angular/core';
import { PaginationService } from './pagination.service';
import { map, switchMap, tap } from 'rxjs';
import { AuthorsService } from './authors.service';

@Injectable()
export class AuthorlistService {
  authorsService = inject(AuthorsService);
  paginationService = inject(PaginationService);

  numFound!: number;
  loadingAuthors?: boolean;
  isDataAvailable: boolean = true;

  fetchData(searchStr: string) {
    this.isDataAvailable = false;
    this.paginationService.currentPageData$ =
      this.paginationService.currentPage$.pipe(
        switchMap((currentPage) =>
          this.authorsService.getAuthorsByName(
            searchStr,
            (currentPage - 1) * this.paginationService.itemsPerPage,
            this.paginationService.itemsPerPage
          )
        ),
        tap((res) => {
          this.numFound = res.numFound;
          this.loadingAuthors = false;

          this.paginationService.checkLastPage(res.numFound);
          this.paginationService.checkFirstPage();
        }),
        map((res: any) => {
          console.log(res.docs);
          return res.docs;
        })
      );
  }
}

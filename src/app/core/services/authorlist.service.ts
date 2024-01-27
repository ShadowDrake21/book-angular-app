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

  fetchData(searchStr: string) {
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
          return res.docs;
        })
      );
  }
}

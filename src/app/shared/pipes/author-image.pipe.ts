import { Pipe, PipeTransform } from '@angular/core';
import { AUTHOR_IMG_URL } from '../../core/constants/books.constants';

@Pipe({
  name: 'authorImage',
  standalone: true,
})
export class AuthorImagePipe implements PipeTransform {
  transform(value: string, size: string, type: string = 'olid'): string {
    return `${AUTHOR_IMG_URL}/${type}/${value}-${size}.jpg`;
  }
}

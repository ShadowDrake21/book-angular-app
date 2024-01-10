import { Pipe, PipeTransform } from '@angular/core';
import { IMG_URL } from '../../core/constants/books.constants';

@Pipe({
  name: 'bookImage',
  standalone: true,
})
export class BookImagePipe implements PipeTransform {
  transform(value: string, size: string): string {
    return `${IMG_URL}${value}-${size}.jpg`;
  }
}

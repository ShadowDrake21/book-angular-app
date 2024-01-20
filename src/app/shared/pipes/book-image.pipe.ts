import { Pipe, PipeTransform } from '@angular/core';
import { IMG_ID_URL, IMG_OLID_URL } from '../../core/constants/books.constants';

@Pipe({
  name: 'bookImage',
  standalone: true,
})
export class BookImagePipe implements PipeTransform {
  transform(value: string, type: string = 'olid', size: string): string {
    let result: string = '';
    switch (type) {
      case 'olid':
        result = `${IMG_OLID_URL}${value}-${size}.jpg`;
        break;
      case 'id':
        result = `${IMG_ID_URL}${value}-${size}.jpg`;
        break;
      default:
        break;
    }
    return result;
  }
}

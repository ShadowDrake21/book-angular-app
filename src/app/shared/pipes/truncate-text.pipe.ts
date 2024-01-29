import { Pipe, PipeTransform } from '@angular/core';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Pipe({
  name: 'truncateText',
  standalone: true,
})
export class TruncateTextPipe implements PipeTransform {
  transform(string: string, length: number, fullText: boolean = false): string {
    if (string.length <= length) {
      return string;
    }
    return !fullText
      ? string.slice(0, length) + '...'
      : string.slice(0, length);
  }
}

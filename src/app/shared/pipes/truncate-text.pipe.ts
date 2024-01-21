import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateText',
  standalone: true,
})
export class TruncateTextPipe implements PipeTransform {
  transform(string: string, length: number, fullText: boolean): string {
    return !fullText
      ? string.slice(0, length) + '...'
      : string.slice(0, length);
  }
}

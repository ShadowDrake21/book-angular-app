import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textDelete',
  standalone: true,
})
export class TextDeletePipe implements PipeTransform {
  transform(givenString: string, rangeStart: number, rangeEnd: number): string {
    return (
      givenString.substring(0, rangeStart) + givenString.substring(rangeEnd + 1)
    );
  }
}

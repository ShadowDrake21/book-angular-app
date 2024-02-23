import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'symbolReplace',
  standalone: true,
})
export class SymbolReplacePipe implements PipeTransform {
  transform(
    givenString: string,
    replacedSymbol: string,
    replacingSymbol: string
  ): string {
    if (replacedSymbol.length !== replacingSymbol.length) return givenString;
    let returnString: string = '';

    let posReplaced: number = givenString.indexOf(replacedSymbol);
    if (posReplaced !== -1) {
      returnString =
        givenString.substring(0, posReplaced) +
        replacingSymbol +
        givenString.substring(posReplaced + 1);
    } else {
      return givenString;
    }

    return returnString;
  }
}

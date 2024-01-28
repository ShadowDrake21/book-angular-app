import { IItemScrollList } from '../models/itemScrollList.model';

export class ObjectManipulations {
  static checkIfHasKey(arr: object, keyStr: string): boolean {
    return Object.keys(arr).some((key) => key === keyStr);
  }

  static constructListObject(
    items: string[],
    isLinks: boolean,
    btnText: string
  ): IItemScrollList {
    return {
      items,
      isLinks,
      btnText,
    };
  }
}

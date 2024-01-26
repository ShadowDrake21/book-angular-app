export class ObjectManipulations {
  static checkIfHasKey(arr: object, keyStr: string): boolean {
    return Object.keys(arr).some((key) => key === keyStr);
  }
}

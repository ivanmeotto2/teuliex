export class EnumUtils {
  static getValue(enumObj: any, enumKey: any) {
    const enumFound = Object.entries(enumObj).find(
      (entryEnum) => entryEnum[0] === enumKey
    );
    return enumFound ? enumFound[1] : '';
  }
}

export function setItemLocalStorage(position: string, value: any) {
  window.localStorage.setItem(position, value);
}

export function getItemLocalStorage(position: string): any {
  return window.localStorage.getItem(position);
}

export function removeItemLocalStorage(position: string): any {
  return window.localStorage.removeItem(position);
}

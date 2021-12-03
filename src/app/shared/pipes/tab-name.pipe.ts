import { Pipe, PipeTransform } from '@angular/core';
import { TABS_NAME } from '../constants/consts';
import { EnumUtils } from '../utils/utils';

@Pipe({
  name: 'transformTabName',
})
export class TabNamePipe implements PipeTransform {
  transform(value: string): string {
    const valuePiped: any = EnumUtils.getValue(TABS_NAME, value);
    return valuePiped.toString();
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countDate'
})
export class CountDatePipe implements PipeTransform {

  transform(date: any): number {
    let ms1 =   new Date(date).getTime();
    let ms2 = new Date().getTime();
    return  Math.abs( Math.ceil((ms2 - ms1) / (24*60*60*1000)));
  }

}

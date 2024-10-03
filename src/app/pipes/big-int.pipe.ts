import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bigInt'
})
export class BigIntPipe implements PipeTransform {

  transform(value: number | string, ...args: unknown[]): string {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (!isNaN(numValue)) {
        if (numValue >= 1000000) {
            return Math.round(numValue / 100000) / 10 + "M"; 
        } else if (numValue >= 1000) {
          console.log(Math.round(numValue / 100) / 10 + "k")
            return Math.round(numValue / 100) / 10 + "k";
        } else {
            return numValue.toString(); 
        }
    }
    return '';
}

}

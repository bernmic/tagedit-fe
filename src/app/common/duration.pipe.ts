import {Pipe, PipeTransform} from "@angular/core";
import {utils} from './utils';

@Pipe({name: 'duration'})
export class DurationPipe implements PipeTransform {

  transform(value: number): string {
    if (isNaN(value)) {
      return "";
    }
    const hours = Math.trunc(value / 3600);
    let seconds = value % 3600;
    const minutes = Math.trunc(seconds / 60);
    seconds = seconds % 60;
    if (hours > 0) {
      return "" + hours + ":" + this.pad(minutes, 2) + ":" + this.pad(seconds, 2);
    }
    return "" + minutes + ":" + this.pad(seconds, 2);
  }

  pad = utils.pad;
}

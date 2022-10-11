import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment/moment";
@Pipe({
  name: "formatDatePost",
})
export class FormatDatePostPipe implements PipeTransform {
  date: string;
  dateFormat: string;
  transform(value: any): string {
    this.date = moment(value).format("DD/MM/YYYY");
    let newDateFormat = this.date;
    return newDateFormat;
  }
}

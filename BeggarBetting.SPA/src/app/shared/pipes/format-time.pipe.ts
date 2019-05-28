import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {  
    transform(value: any): string {
    const hours: any = ('00'+ Math.floor(value/3600)).slice(-2);
    const minutes: any = ('00'+ Math.floor(value/60)%60).slice(-2);
    return hours + ' : ' + minutes + ' : ' + ('00'+Math.floor(value-minutes * 60)).slice(-2);
    }
}
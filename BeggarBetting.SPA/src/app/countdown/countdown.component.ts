import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core'
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'countdown',
  template: '{{ countDown | async | formatTime }}'
})
export class CountdownComponent implements OnInit {
  @Input() seconds: string;
  @Output() checkTime: EventEmitter<number> = new EventEmitter();
  countDown: any;

  constructor() {}
  
  ngOnInit() {
    const start = parseInt(this.seconds, 10);
    this.countDown = Observable.timer(0, 1000)
                .map(i => start - i) // decrement the stream's value and return
                .takeWhile(i => i >= 0)
                .do(s => this.checkTime.emit(s)) // do a side effect without affecting value
  }
}
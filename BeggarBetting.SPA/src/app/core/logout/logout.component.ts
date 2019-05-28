import { AccountService } from '../../shared/services/account.service';
import { Component, OnInit, trigger, transition, style, animate } from '@angular/core';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  animations: [
    trigger('easeInOut', [
      transition(':enter', [
        style({
          opacity: 0
        }),
        animate("1s ease-in-out", style({
          opacity: 1
        }))
      ]),
      transition(':leave', [
        style({
          opacity: 1
        }),
        animate("1s ease-in-out", style({
          opacity: 0
        }))
      ])
    ])
  ]
})
export class LogoutComponent implements OnInit {
  keystore: any;
  message: string;
  password: string;

  constructor(public acctService: AccountService) { }

  ngOnInit() {
    this.acctService.handleLogout();
  }
}
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountService } from 'app/shared/services/account.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor(private titleService: Title,
    public acctService: AccountService) {
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
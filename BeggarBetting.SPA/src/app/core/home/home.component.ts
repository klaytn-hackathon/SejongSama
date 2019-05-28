import { AccountService } from './../../shared/services/account.service';
import { CavService } from '../../shared/services/cav.service';
import { ConfigService } from '../../shared/utils/config.service';
import { Component, OnInit, trigger, style, transition, animate } from '@angular/core';
import { DataSharingService } from 'app/shared/services/data-sharing.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
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

export class HomeComponent implements OnInit {
  apiHost: string;
  hasLoggedIn: boolean = false;
  vagabond: boolean = false;
  tramp: boolean = false;
  middleclass: boolean = false;
  panhandler: boolean = false;
  account: string;
  balance: any;

  constructor(private configService: ConfigService,
    private cavService: CavService,
    private acctService: AccountService,
    private dataSharingService: DataSharingService) { 
      this.dataSharingService.isBalanceUpdated.subscribe(flag => {
        if (flag) {
          const walletInstance = this.acctService.getWallet();
          this.acctService.getBalance(walletInstance.address)
          .then((value) => {
            if (value) {
              this.balance = this.cavService.convertFromPeb(value);
            }
          })
        }
      });
    }

  ngOnInit() {
    this.apiHost = this.configService.getApiHost();
    this.onReady();
  }

  onReady = (): void => {
    this.acctService.start();
    const walletInstance = this.acctService.getWallet();

    if (!walletInstance) {
      return;
    } else {
      this.cavService.getBetterNumOfWinnings(walletInstance.address).then((value) => {
        value = 21; //testing               
        this.definePrivilege(value);
      });
      this.acctService.getBalance(walletInstance.address)
        .then((value) => {
          if (value) {
            this.balance = this.cavService.convertFromPeb(value);
          }
        })
      this.account = walletInstance.address;
      this.hasLoggedIn = this.acctService.isAuthenticated();
    }
  };

  definePrivilege(value: number): void {
    if (value >= 3 && value < 8) {
      this.panhandler = true;
    }
    if (value >= 8 && value < 15) {
      this.panhandler = true;
      this.vagabond = true;
    }
    if (value >= 15 && value < 21) {
      this.panhandler = true;
      this.vagabond = true;
      this.tramp = true;
    }
    if (value >= 21) {
      this.panhandler = true;
      this.vagabond = true;
      this.tramp = true;
      this.middleclass = true;
    }
  }
}
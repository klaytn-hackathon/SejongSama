import { AccountService } from './../shared/services/account.service';
import { environment } from './../../environments/environment';
import { IBetterBettingInfo, IMatchInfo } from './../shared/interfaces';
import { Component, OnInit, trigger, transition, style, animate } from '@angular/core';
import { DataService } from './../shared/services/data.service';
import { NotificationService } from './../shared/utils/notification.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CavService } from '../shared/services/cav.service';
import { DataSharingService } from 'app/shared/services/data-sharing.service';

@Component({
  selector: 'myhistory',
  templateUrl: './myhistory.component.html',
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
export class MyhistoryComponent implements OnInit {
  betterBettingInfo: IBetterBettingInfo[] = [];
  matchInfo: IMatchInfo[] = [];
  hasRecords: boolean;
  isSubmitted: boolean = false;
  betterAddress: string;
  //sorting
  key: string = 'dateEvent'; //set default
  reverse: boolean = false;
  hasLoggedIn: boolean = false;
  account: string;
  walletInstance: any;
  transactionScope: any;
  balance: any;

  constructor(private dataService: DataService,
    private notificationService: NotificationService,
    private spinnerService: Ng4LoadingSpinnerService,
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
    this.acctService.start();
    const walletInstance = this.acctService.getWallet();

    if (!walletInstance) {
      return false;
    } else {
      this.walletInstance = walletInstance;
      this.acctService.getBalance(walletInstance.address)
        .then((value) => {
          if (value) {
            this.balance = this.cavService.convertFromPeb(value);
          }
        })
      this.account = walletInstance.address;
      this.hasLoggedIn = true;
    }
  }

  loadBetterBettingInfo(): void {
    if (this.account.toLowerCase() != this.betterAddress.toLowerCase()) {
      // owner can search user's history for admin purpose
      if (this.account.toLowerCase() != environment.owner.toLowerCase()) {
        this.notificationService.printErrorMessage('You can only search with your logged in account.');
        return;
      }
    } else {
      this.spinnerService.show();
      this.isSubmitted = true;
      var bbInfo = this.cavService.getBetterBettingInfo(this.betterAddress);
      var bbInfo2 = this.cavService.getBetterBettingInfo2(this.betterAddress);

      bbInfo.then((value1) => {
        bbInfo2.then((value2) => {
          this.handleBettingInfo(value1, value2)
        });
      });
    }
  }

  handleBettingInfo(value1: any, value2: any): void {
    // Complete better's betting information retrieved from the blockchain
    for (var i = 0; i < value1.matchId.length; i++) {
      var bbInfo: IBetterBettingInfo =
      {
        matchId: +value1.matchId[i],
        awayTeamScore: value1.awayTeamScore[i],
        homeTeamScore: value1.homeTeamScore[i],
        bettingPrice: this.cavService.convertFromPeb(value1.bettingPrice[i]),
        isWinner: value2.isWinner[i],
        hasReceivedPrize: value2.hasReceivedPrize[i],
        winningPrize: value2.winningPrize[i],
        numOfWinners: value2.numOfWinners[i],
        numOfBetters: value2.numOfBetters[i],
        isGameInProgress: false,
        homeTeam: "",
        awayTeam: "",
        dateEvent: "",
        awayFinalScore: 0,
        homeFinalScore: 0
      }
      this.betterBettingInfo.push(bbInfo);
    }

    this.accessMatchInfoFromAPI(value1.matchId);
  }

  accessMatchInfoFromAPI(matchIds: string[]): void {
    // Pull match ids and their scores from API
    this.dataService.getMatchInfo(matchIds)
      .subscribe((res: IMatchInfo[]) => {
        this.matchInfo = res;
        this.spinnerService.hide();

        if (this.matchInfo.length === 0) {
          this.hasRecords = false;
          this.notificationService.printSuccessMessage('No records for this better!');
        } else {
          var result = this.processMatchInfo(this.matchInfo); // Find matching scores
          if (result) {
            this.hasRecords = true;
            this.notificationService.printSuccessMessage('Better records loaded!');
          } else {
            this.hasRecords = false;
            this.notificationService.printErrorMessage('Failed to load the records.');
          }
        }
      },
        error => {
          this.notificationService.printErrorMessage('Failed to load the records. ');
          this.hasRecords = false;
          this.spinnerService.hide();
        });
  }

  processMatchInfo(matchInfo: IMatchInfo[]): boolean {
    var success = true;

    for (var i = 0; i <= this.matchInfo.length - 1; i++) {
      if (this.matchInfo[i].matchId === this.betterBettingInfo[i].matchId) {
        this.betterBettingInfo[i].homeTeam = this.matchInfo[i].homeTeam;  // Assign homeTeam name from API
        this.betterBettingInfo[i].awayTeam = this.matchInfo[i].awayTeam; // Assign awayTeam name from API
        // Match finished, scores match 
        if (this.matchInfo[i].awayTeamScore === this.betterBettingInfo[i].awayTeamScore &&
          this.matchInfo[i].homeTeamScore === this.betterBettingInfo[i].homeTeamScore) {
          this.betterBettingInfo[i].isWinner = true;
          this.betterBettingInfo[i].dateEvent = this.matchInfo[i].dateEvent;
        }

        // Match finished, either score doesn't match
        if (this.matchInfo[i].awayTeamScore !== this.betterBettingInfo[i].awayTeamScore ||
          this.matchInfo[i].homeTeamScore !== this.betterBettingInfo[i].homeTeamScore) {
          this.betterBettingInfo[i].isWinner = false;
          this.betterBettingInfo[i].dateEvent = this.matchInfo[i].dateEvent;
          this.betterBettingInfo[i].awayFinalScore = this.matchInfo[i].awayTeamScore; // Assign final score
          this.betterBettingInfo[i].homeFinalScore = this.matchInfo[i].homeTeamScore; // Assign final score
        }
        // Match not done, no scores yet            
        if (this.matchInfo[i].awayTeamScore.toString() == "" && this.matchInfo[i].homeTeamScore.toString() == "") {
          this.betterBettingInfo[i].isGameInProgress = true;
          this.betterBettingInfo[i].dateEvent = this.matchInfo[i].dateEvent;
        }
        // Failed to retrieve corresponding matchId from API  
      } else {
        return false;
      }
    }

    return success;
  }

  callClaimPrizes(bbInfo: IBetterBettingInfo): void {
    this.spinnerService.show();
    var hasAlreadyReceived = this.cavService.checkPrizeAlreadyReceived(this.account, bbInfo.matchId, bbInfo.bettingPrice);
    hasAlreadyReceived.then((value) => {
      if (value) {
        this.spinnerService.hide();
        this.notificationService.printErrorMessage('You have already received the prize.');
      } else {
        var result = this.cavService.claimPrizes(bbInfo.matchId,
          bbInfo.homeTeamScore,
          bbInfo.awayTeamScore,
          bbInfo.bettingPrice,
          this.walletInstance)

        result.then((value) => {
          if (value) {
            this.betterBettingInfo = []; // Clear array
            // Reload the table after claim prize is processed
            var bbInfo = this.cavService.getBetterBettingInfo(this.betterAddress);
            var bbInfo2 = this.cavService.getBetterBettingInfo2(this.betterAddress);

            bbInfo.then((value1) => {
              bbInfo2.then((value2) => {
                this.handleBettingInfo(value1, value2)
              });
            });
            this.spinnerService.hide();
            this.notificationService.printSuccessMessage('Congrats! You have won the prize!');
            this.transactionScope = value.transactionHash;
            this.dataSharingService.isBalanceUpdated.next(true);
          } else {
            this.spinnerService.hide();
            this.notificationService.printErrorMessage('Failed to claim prize.');
          }
        });
      }
    });
  }

  refresh(): void {
    window.location.reload();
  }

  getRowColor(bbInfo: IBetterBettingInfo): string {
    if (bbInfo.isWinner)
      return '#b9fdba';
    if (bbInfo.isWinner == false && bbInfo.isGameInProgress == false)
      return '#ffc0b2';
    if (bbInfo.isGameInProgress)
      return '#f8ca7a';
  }

  sort(key): void {
    this.key = key;
    this.reverse = !this.reverse;
  }
}
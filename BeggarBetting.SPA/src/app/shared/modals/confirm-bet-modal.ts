import { AccountService } from './../services/account.service';
import { DataService } from './../../shared/services/data.service';
import { NotificationService } from './../../shared/utils/notification.service';
import { ModalDirective } from 'ngx-bootstrap';
import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { IDailySchedule } from '../../shared/interfaces';
import { NgForm } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CavService } from '../services/cav.service';
import { DataSharingService } from '../services/data-sharing.service';

@Component({
  selector: 'confirm-bet-modal',
  templateUrl: './confirm-bet-modal.html',
})

export class ConfirmBetModalComponent {
  @ViewChild('confirmBetModal') public confirmBetModal: ModalDirective;
  @Input() schedule: IDailySchedule;
  @Output() request: EventEmitter<number> = new EventEmitter();
  @Output() scope: EventEmitter<any> = new EventEmitter();
  balance: string;

  constructor(private dataService: DataService,
    private notificationService: NotificationService,
    private spinnerService: Ng4LoadingSpinnerService,
    private cavService: CavService,
    private acctService: AccountService,
    private dataSharingService: DataSharingService) { }

  submitBettingScore(form: NgForm): void {
    this.spinnerService.show();
    this.acctService.start();
    const walletInstance = this.acctService.getWallet();

    if (!walletInstance) return;

    this.dataService.GetTimeCheck(this.schedule.matchId.toString(), this.schedule.league)
      .subscribe((res: boolean) => {
        res = false;
        if (res) {
          form.reset();
          this.spinnerService.hide();
          this.confirmBetModal.hide();
          this.notificationService.printErrorMessage('Game has already started!');
        } else {
          var hasDuplicate = this.cavService.checkDuplicateMatchId(walletInstance.address, this.schedule.matchId, this.schedule.bettingPrice);
          hasDuplicate.then((value) => {
            value = false;
            if (value == false) {
              var result = this.cavService.placeBet(this.schedule, walletInstance);
              result.then((value) => {
                if (value.status) {
                  form.reset();
                  this.spinnerService.hide();
                  this.confirmBetModal.hide();
                  this.notificationService.printSuccessMessage('Submitted successfully! :)');
                  this.request.emit(this.schedule.matchId);
                  this.scope.emit(value.transactionHash);
                  this.dataSharingService.isBalanceUpdated.next(true);
                  this.closeModal();
                } else if (value === 'undefined' || !value || !value.status) {
                  form.reset();
                  this.spinnerService.hide();
                  this.confirmBetModal.hide();
                  this.notificationService.printErrorMessage('Failed to submit your bet :(');
                }
              })
            } else {
              form.reset();
              this.spinnerService.hide();
              this.confirmBetModal.hide();
              this.notificationService.printErrorMessage('You have already submitted this bet!');
            }
          })
        }
      },
        error => {
          form.reset();
          this.spinnerService.hide();
          this.confirmBetModal.hide();
          this.notificationService.printErrorMessage('Failed to connect to the server :(' + error);
        });
  }

  openModal() {
    this.confirmBetModal.show();
  }

  closeModal() {
    this.confirmBetModal.hide();
  }
}
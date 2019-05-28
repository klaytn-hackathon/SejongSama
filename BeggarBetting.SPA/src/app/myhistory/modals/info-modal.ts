import { CavService } from '../../shared/services/cav.service';
import { ModalDirective } from 'ngx-bootstrap';
import { Component, ViewChild, Input} from '@angular/core';
import { IBetterBettingInfo } from '../../shared/interfaces';

@Component({
  selector: 'info-modal',
  templateUrl: './info-modal.html',
})

export class InfoModalComponent {  
  @ViewChild('infoModal') public infoModal: ModalDirective; 
  @Input() info: IBetterBettingInfo;
  commission: number; 
  constructor(private cavService: CavService) {}   
 
  openModal() {    
    this.info.winningPrize = this.cavService.convertFromPeb(this.info.winningPrize);
    
    if (this.info.numOfWinners == 1) {
      this.commission = this.info.bettingPrice * this.info.numOfBetters * 3 / 100;    
      this.info.winningPrize = (this.info.bettingPrice * this.info.numOfBetters) - this.commission;
    } else if (this.info.numOfWinners > 1) {
      this.commission = ((this.info.bettingPrice * this.info.numOfBetters) / this.info.numOfWinners) * 3 / 100;    
      this.info.winningPrize = ((this.info.bettingPrice * this.info.numOfBetters) / this.info.numOfWinners) - this.commission;
    }
    
    this.infoModal.show();
  }

  closeModal() {
    this.infoModal.hide();
  }
}
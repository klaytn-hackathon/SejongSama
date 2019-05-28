import { MappingService } from '../utils/mapping.service';
import { Injectable } from "@angular/core";
import { ItemsService } from "../utils/item.service";
import { IGetBetterBettingInfo, IGetBetterBettingInfo2, IDailySchedule, IGetInfoPanel } from "../interfaces";
import { environment } from './../../../environments/environment';

declare global {
  interface Window {
    cav: any;
    agContract: any;
  }
}

window.cav = window.cav || {};
window.agContract = window.agContract || {};

@Injectable()
export class CavService {
  cav: any;
  agContract: any;
  providerPK: string;
  provider: string;
  contractAddress: string;

  constructor(private itemsService: ItemsService,
    private mappingService: MappingService) {
    this.cav = window.cav;
    this.agContract = window.agContract;
    this.providerPK = environment.pk;
    this.provider = environment.owner;
    this.contractAddress = environment.contractAddress;
  }

  placeBet(schedule: IDailySchedule, walletInstance: any): Promise<any> {
    var bettingPrice = this.convertToPeb(schedule.bettingPrice);

    return this.cav.klay.accounts.signTransaction({
      type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
      from: walletInstance.address,
      to: this.contractAddress,
      data: this.agContract.methods.placeBet(schedule.matchId,
        schedule.homeTeamScore,
        schedule.awayTeamScore,
        bettingPrice).encodeABI(),
      gas: '300000',
      value: bettingPrice,
    }, walletInstance.privateKey)
      .then((value) => {
        if (value) {
          const feePayerPrivateKey = this.providerPK;
          this.cav.klay.accounts.wallet.add(feePayerPrivateKey);

          return this.cav.klay.sendTransaction({
            feePayer: this.provider,
            senderRawTransaction: value.rawTransaction
          })
            .then((value) => {
              return value;
            })
            .catch((e) => {
              console.log(e);
              return false;
            });
        } else {
          return false;
        }
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
  }

  claimPrizes(matchId: number,
    homeTeamScore: number,
    awayTeamScore: number,
    bettingPrice: number,
    walletInstance: any): Promise<any> {
    return this.cav.klay.accounts.signTransaction({
      type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
      from: walletInstance.address,
      to: this.contractAddress,
      data: this.agContract.methods.claimPrizes(matchId,
        homeTeamScore,
        awayTeamScore,
        this.convertToPeb(bettingPrice)).encodeABI(),
      gas: '300000'
    }, walletInstance.privateKey)
      .then((value) => {
        if (value) {
          const feePayerPrivateKey = this.providerPK;
          this.cav.klay.accounts.wallet.add(feePayerPrivateKey);

          return this.cav.klay.sendTransaction({
            feePayer: this.provider,
            senderRawTransaction: value.rawTransaction
          })
            .then((value) => {
              return value;
            })
            .catch((e) => {
              console.log(e);
              return false;
            });
        } else {
          return false;
        }
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
  }

  getBetterBettingInfo(betterAddress: string): Promise<any> {
    return this.agContract.methods.getBetterBettingInfo(betterAddress).call()
      .then((value) => {
        var serialized = this.itemsService.getSerialized<IGetBetterBettingInfo>(value);
        return this.mappingService.mapValueToGetBetterBettingInfo(serialized);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getBetterBettingInfo2(betterAddress: string): Promise<any> {
    return this.agContract.methods.getBetterBettingInfo2(betterAddress).call()
      .then((value) => {
        var serialized = this.itemsService.getSerialized<IGetBetterBettingInfo2>(value);
        return this.mappingService.mapValueToGetBetterBettingInfo2(serialized);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  checkDuplicateMatchId(account: string, matchId: number, bettingPrice: number): Promise<any> {
    return this.agContract.methods.checkDuplicateMatchId(account, matchId, this.convertToPeb(bettingPrice)).call()
      .then((value) => {
        return value;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  checkPrizeAlreadyReceived(account: string, matchId: number, bettingPrice: number): Promise<any> {
    return this.agContract.methods.checkPrizeAlreadyReceived(account, matchId, this.convertToPeb(bettingPrice)).call()
      .then((value) => {
        return value;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getNumOfBettersForMatchAndPrice(matchId: number, bettingPrice: number): Promise<any> {
    return this.agContract.methods.getNumOfBettersForMatchAndPrice(matchId, this.convertToPeb(bettingPrice)).call()
      .then((value) => {
        return this.itemsService.getSerialized<number>(value);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getBetterNumOfWinnings(betterAddress: string): Promise<number> {
    return this.agContract.methods.getBetterNumOfWinnings(betterAddress).call()
      .then((value) => {
        return this.itemsService.getSerialized<number>(value);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getInfoPanel(): Promise<any> {
    return this.agContract.methods.getInfoPanel().call()
      .then((value) => {
        var serialized = this.itemsService.getSerialized<IGetInfoPanel>(value);
        return this.mappingService.mapValueToIGetInfoPanel(serialized);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  convertToPeb(amount: any) {
    return this.cav.utils.toPeb(amount.toString(), "KLAY");
  }

  convertFromPeb(amount: any) {
    return this.cav.utils.fromPeb(amount.toString(), "KLAY");
  }
}
import { Injectable } from '@angular/core';
import { IGetBetterBettingInfo, IGetBetterBettingInfo2, IGetInfoPanel } from '../interfaces';

@Injectable()
export class MappingService {

    constructor() {}

    mapValueToGetBetterBettingInfo(value: any): IGetBetterBettingInfo {
        var bbInfo: IGetBetterBettingInfo = {
            matchId: value[0],
            homeTeamScore: value[1],
            awayTeamScore: value[2],
            bettingPrice: value[3]
        }

        return bbInfo;
    }

    mapValueToGetBetterBettingInfo2(value: any): IGetBetterBettingInfo2 {
        var bbInfo2: IGetBetterBettingInfo2 = {
            isWinner: value[0],
            hasReceivedPrize: value[1],
            winningPrize: value[2],
            numOfWinners: value[3],
            numOfBetters: value[4]
        }

        return bbInfo2;
    }

    mapValueToIGetInfoPanel(value: any): IGetInfoPanel {
        var infoPanel: IGetInfoPanel = {
            numOfPanhandler: value[0],   
            numOfVagabond: value[1],
            numOfTramp: value[2],
            numOfMiddleClass: value[3]  
        }
        return infoPanel;
    }
}
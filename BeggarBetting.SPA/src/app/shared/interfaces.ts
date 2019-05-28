export interface IDailySchedule {   
    matchId: number;
    date: string;
    time: string;   
    awayTeam: string;
    homeTeam: string;
    awayTeamScore: number;
    homeTeamScore: number;
    gameStartsIn: string;
    hasNoEvents: boolean;
    bettingPrice: number;
    numOfBetters: number;
    league: string;
}

export interface IMatchInfo {   
    matchId: number;   
    awayTeamScore: number;
    homeTeamScore: number;
    homeTeam: string;
    awayTeam: string;
    dateEvent: string;
}

export interface IBetterBettingInfo {
    matchId: number;
    awayTeamScore: number;
    homeTeamScore: number;
    bettingPrice: number;   
    isWinner: boolean; 
    hasReceivedPrize: boolean;
    winningPrize: number;
    numOfWinners: number; 
    numOfBetters: number;  
    isGameInProgress: boolean;
    homeTeam: string;
    awayTeam: string;
    dateEvent: string;
    awayFinalScore: number;
    homeFinalScore: number;
}

export interface IGetBetterBettingInfo {
    matchId: number[];
    homeTeamScore: number[];
    awayTeamScore: number[]; 
    bettingPrice: number[];   
}

export interface IGetBetterBettingInfo2 {  
    isWinner: boolean[];  
    hasReceivedPrize: boolean[];
    winningPrize: number[];
    numOfWinners: number[];   
    numOfBetters: number[];   
}

export interface IGetInfoPanel {      
    numOfPanhandler: number;   
    numOfVagabond: number;
    numOfTramp: number;   
    numOfMiddleClass: number;      
}

export interface Pagination {
    CurrentPage : number;
    ItemsPerPage : number;
    TotalItems : number;
    TotalPages: number;
}

export class PaginatedResult<T> {
    result :  T;
    pagination : Pagination;
}

export interface Predicate<T> {
    (item: T): boolean
}
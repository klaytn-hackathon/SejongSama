using System;

namespace BeggarBetting.Model.API
{
    public class BetterBettingInfo
    {      
        public long MatchId { get; set; }      
        public int AwayTeamScore { get; set; }
        public int HomeTeamScore { get; set; }
        public int BettingPrice { get; set; }
        public bool IsWinner { get; set; }
        public bool HasReceivedPrize { get; set; }
        public long WinningPrize { get; set; }
        public int NumOfWinners { get; set; }
        public int NumOfBetters { get; set; }
        public bool IsGameInProgress { get; set; }        
        public string HomeTeam { get; set; }
        public string AwayTeam { get; set; }
    }
}
using System;

namespace BeggarBetting.Model.API
{
    public class MatchInfo
    {      
        public long MatchId { get; set; }      
        public string AwayTeamScore { get; set; }
        public string HomeTeamScore { get; set; }
        public string HomeTeam { get; set; }
        public string AwayTeam { get; set; }
        public string DateEvent { get; set; }
    }
}
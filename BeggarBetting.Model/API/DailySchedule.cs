using System;

namespace BeggarBetting.Model.API
{
    public class DailySchedule
    {      
        public long MatchId { get; set; }
        public string Date { get; set; }
        public string AwayTeam { get; set; }
        public string HomeTeam { get; set; }
        public int AwayTeamScore { get; set; }
        public int HomeTeamScore { get; set; }
        public string GameStartsIn { get; set; }
        public bool HasNoEvents { get; set; }
        public uint BettingPrice { get; set; }
        public string League { get; set; }
    }
}
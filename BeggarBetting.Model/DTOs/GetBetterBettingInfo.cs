using Nethereum.ABI.FunctionEncoding.Attributes;
using System;
using System.Collections.Generic;
using System.Numerics;
using System.Text;

namespace BeggarBetting.Model.DTOs
{
    [FunctionOutput]
    public class GetBetterBettingInfo
    {
        [Parameter("uint256[]", "matchId", 1)]
        public List<BigInteger> MatchId { get; set; }

        [Parameter("uint[]", "homeTeamScore", 2)]
        public List<uint> HomeTeamScore { get; set; }

        [Parameter("uint[]", "awayTeamScore", 3)]
        public List<uint> AwayTeamScore { get; set; }

        [Parameter("uint[]", "bettingPrice", 4)]
        public List<uint> BettingPrice { get; set; }
    }   
}
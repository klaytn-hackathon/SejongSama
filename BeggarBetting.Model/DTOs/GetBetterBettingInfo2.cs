using Nethereum.ABI.FunctionEncoding.Attributes;
using System;
using System.Collections.Generic;
using System.Numerics;
using System.Text;

namespace BeggarBetting.Model.DTOs
{
    [FunctionOutput]
    public class GetBetterBettingInfo2
    {       
        [Parameter("bool[]", "isWinner", 1)]
        public List<bool> IsWinner { get; set; }

        [Parameter("bool[]", "hasReceivedPrize", 2)]
        public List<bool> HasReceivedPrize { get; set; }

        [Parameter("uint256[]", "winningPrize", 3)]
        public List<BigInteger> WinningPrize { get; set; }

        [Parameter("uint256[]", "numOfWinners", 4)]
        public List<BigInteger> NumOfWinners { get; set; }
    }   
}
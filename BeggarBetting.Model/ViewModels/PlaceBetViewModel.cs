using Nethereum.ABI.FunctionEncoding.Attributes;
using System;
using System.Collections.Generic;
using System.Numerics;
using System.Text;

namespace BeggarBetting.Model.ViewModels
{    
    public class PlaceBetViewModel
    {
        public BigInteger MatchId { get; set; }
        public uint Hts { get; set; }
        public uint Ats { get; set; }
        public uint BettingPrice { get; set; }
    }   
}
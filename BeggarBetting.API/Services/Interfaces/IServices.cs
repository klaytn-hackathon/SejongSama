using BeggarBetting.Model.API;
using Nethereum.Contracts;
using System.Collections.Generic;
using System.Numerics;
using System.Threading;
using System.Threading.Tasks;

namespace BeggarBetting.API.Services.Interfaces
{
    public interface IApiRequestService
    {
        Task<List<DailySchedule>> DailyScheduleRequest();
        Task<List<MatchInfo>> MatchInfoRequest(string[] matchIds);
        Task<bool> IsGameStarted(string matchId, string league);
    }
}
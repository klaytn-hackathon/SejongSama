using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BeggarBetting.API.Services.Interfaces;

namespace BeggarBetting.API.Controllers
{
    [Route("api/[controller]")]
    public class ScheduleController : Controller
    {
        private readonly IApiRequestService _apiRequest;

        public ScheduleController(IApiRequestService apiRequest)
        {
            _apiRequest = apiRequest;
        }

        [HttpGet("DailySchedule")]
        public async Task<IActionResult> GetDailySchedule()
        {
            var schedules = await _apiRequest.DailyScheduleRequest();

            return new OkObjectResult(schedules);
        }

        [HttpGet("MatchInfo")]
        public async Task<IActionResult> GetMatchInfo([FromQuery] string[] matchIds)
        {
            var result = await _apiRequest.MatchInfoRequest(matchIds);

            return new OkObjectResult(result);
        }

        [HttpGet("TimeCheck")]
        public async Task<IActionResult> GetTimeCheck([FromQuery] string matchId, string league)
        {
            var result = await _apiRequest.IsGameStarted(matchId, league);

            return new OkObjectResult(result);
        }
    }
}
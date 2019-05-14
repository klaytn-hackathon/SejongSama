using BeggarBetting.API.Services.Interfaces;
using BeggarBetting.Model;
using BeggarBetting.Model.API;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace BeggarBetting.API.Services
{
    public class ApiRequestService : IApiRequestService
    {      
        private readonly string _apiKey;

        public ApiRequestService([FromServices] IConfiguration config)
        {
            _apiKey = config.GetValue<string>("Request:APIKey");
        }

        #region DailySchedule
        public async Task<List<DailySchedule>> DailyScheduleRequest()
        {
            var epl = await DailySchedules("english premier league");
            var bundesliga = await DailySchedules("german bundesliga");
            var laliga = await DailySchedules("spanish la liga");
            var serieA = await DailySchedules("italian serie a");
            var mls = await DailySchedules("american major league soccer");
            //var mlb = await DailySchedules("mlb");         
            var ds = new List<List<DailySchedule>> { epl, bundesliga, laliga, serieA, mls };

            return GetFinalizedSchedules(ds);
        }
        #endregion   

        #region MatchInfo
        public async Task<List<MatchInfo>> MatchInfoRequest(string[] matchIds)
        {
            var matchInfo = new List<MatchInfo>();

            foreach (var matchId in matchIds)
            {
                var url = $"http://www.thesportsdb.com/api/v1/json/{_apiKey}/lookupevent.php?id={matchId}"; // prod
                //var url = "http://www.thesportsdb.com/api/v1/json/1/lookupevent.php?id=" + matchId; // dev
                var request = (HttpWebRequest)WebRequest.Create(new Uri(url));

                using (WebResponse response = await request.GetResponseAsync())
                {
                    using (Stream stream = response.GetResponseStream())
                    {
                        StreamReader reader = new StreamReader(stream);
                        var json = reader.ReadToEnd(); // Read the content                       
                        var results = JsonConvert.DeserializeObject<dynamic>(json);

                        if (results.events != null)
                        {
                            foreach (dynamic ev in results.events)
                            {
                                if (ev.idEvent.ToString().Equals(matchId.ToString()))
                                {
                                    matchInfo.Add(new MatchInfo
                                    {
                                        MatchId = Convert.ToInt64(matchId),
                                        AwayTeamScore = ev.intAwayScore.ToString(),
                                        HomeTeamScore = ev.intHomeScore.ToString(),
                                        HomeTeam = ev.strHomeTeam.ToString(),
                                        AwayTeam = ev.strAwayTeam.ToString(),
                                        DateEvent = ev.dateEvent.ToString()
                                    });
                                }
                            }
                        }
                    }
                }
            }

            return matchInfo;
        }
        #endregion

        #region IsGameStarted
        public async Task<bool> IsGameStarted(string matchId, string league)
        {
            string time = "";
            var url = $"http://www.thesportsdb.com/api/v1/json/{_apiKey}/lookupevent.php?id={matchId}"; // prod
            //var url = "http://www.thesportsdb.com/api/v1/json/1/lookupevent.php?id=" + matchId; // dev
            var request = (HttpWebRequest)WebRequest.Create(new Uri(url));

            using (WebResponse response = await request.GetResponseAsync())
            {
                using (Stream stream = response.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(stream);
                    var json = reader.ReadToEnd(); // Read the content                       
                    var results = JsonConvert.DeserializeObject<dynamic>(json);

                    if (results.events != null)
                    {
                        foreach (dynamic ev in results.events)
                        {
                            var dtUtc = DateTime.UtcNow;
                            string strTime = ev.strTime;
                            DateTime dateEvent = ev.dateEvent;
                            var dateEventToString = dateEvent.ToString("yyyy-MM-dd");

                            time = CalculateUtcTimeDifference(strTime, dtUtc, dateEventToString, league);
                        }
                    }
                }
            }

            return Convert.ToDouble(time) <= 0 ? true : false;
        }
        #endregion

        #region Private functions   
        private async Task<List<DailySchedule>> DailySchedules(string league)
        {
            //var dtUtc = new DateTime(2019, 05, 09);
            var dtUtc = DateTime.UtcNow;
            var date = dtUtc.ToString("yyyy-MM-dd");
            league = league.Replace(' ', '+');
            var dailySchedules = new List<DailySchedule>();
            var todaySchedule = $"http://www.thesportsdb.com/api/v1/json/{_apiKey}/eventsday.php?d={date}&l={league}"; // prod
            //var todaySchedule = "http://www.thesportsdb.com/api/v1/json/1/eventsday.php?d=" + "2018-02-24" + "&l=" + league; // dev
            var request = (HttpWebRequest)WebRequest.Create(new Uri(todaySchedule));

            using (WebResponse response = await request.GetResponseAsync())
            {
                using (Stream stream = response.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(stream);
                    var json = reader.ReadToEnd(); // Read the content                       
                    var results = JsonConvert.DeserializeObject<dynamic>(json);

                    if (results.events == null)
                    {
                        dailySchedules.Add(new DailySchedule { Date = date, HasNoEvents = true });
                        return dailySchedules;
                    }

                    foreach (dynamic ev in results.events)
                    {
                        string strTime = ev.strTime;
                        var ds = new DailySchedule
                        {
                            MatchId = ev.idEvent,
                            Date = date,                            
                            AwayTeam = ev.strAwayTeam,
                            HomeTeam = ev.strHomeTeam,
                            GameStartsIn = CalculateUtcTimeDifference(strTime, dtUtc, date, league),
                            League = ChangeLeagueName(ev.strLeague.ToString())
                        };

                        if (Convert.ToDouble(ds.GameStartsIn) > 0)
                            dailySchedules.Add(ds);
                    }
                }
            }

            if (dailySchedules.Count == 0)
            {
                dailySchedules.Add(new DailySchedule { Date = date, HasNoEvents = true });
                return dailySchedules;
            }

            return dailySchedules;
        }  
        private List<DailySchedule> GetFinalizedSchedules(List<List<DailySchedule>> ds)
        {
            var fs = new List<DailySchedule>();
            fs = PreventLessSchedules(ds);

            // Add all available leagues when there is no response from major soccer leagues.
            if (fs.Count < 1)
            {
                foreach (var s in ds)
                {
                    if (!s[0].HasNoEvents)
                    {
                        fs.AddRange(s); 
                        //fs.AddRange(GetRandomElements(s, 2)); // Get two random events per league
                    }
                }
            }

            return CheckNoEventsToday(fs);
        }
        private List<DailySchedule> PreventLessSchedules(List<List<DailySchedule>> ds)
        {
            var newSchedule = new List<DailySchedule>();

            // When there are no events for european soccer leagues, add extra mlb events instead
            if (ds[0][0].HasNoEvents && ds[1][0].HasNoEvents && ds[2][0].HasNoEvents && ds[3][0].HasNoEvents)
            {
                // MLB has events
                // (!ds[5][0].HasNoEvents)
                //{
                    // MLS has events
                    if (!ds[4][0].HasNoEvents)
                    {                        
                        // Add three each MLS & MLB events
                        var mls = GetRandomElements(ds[4], 10);
                        //var mls = GetRandomElements(ds[4], 3);
                        //var mlb = GetRandomElements(ds[5], 3);
                        newSchedule.AddRange(mls);
                        //newSchedule.AddRange(mlb);
                    }

                    //newSchedule = GetRandomElements(ds[5], 5); // Get random events in the list
                //}
                else
                {   
                    // MLS has events
                    if (!ds[4][0].HasNoEvents)
                    {
                        // Add three MLS events
                        var mls = GetRandomElements(ds[4], 10);
                        //var mls = GetRandomElements(ds[4], 3);                       
                        newSchedule.AddRange(mls);
                    }           
                }
            }         

            return newSchedule;
        }
        private List<DailySchedule> GetRandomElements(List<DailySchedule> list, int elementsCount)
        {
            return list.OrderBy(arg => Guid.NewGuid()).Take(elementsCount).ToList();
        }
        private List<DailySchedule> CheckNoEventsToday(List<DailySchedule> fs)
        {
            // Return current date when all leagues do not have any event(s)
            if (fs.Count == 0)
            {
                var dtUtc = DateTime.UtcNow;
                var date = dtUtc.ToString("yyyy-MM-dd");
                fs.Add(new DailySchedule { Date = date, HasNoEvents = true });

                return fs;
            }
            else
            {
                fs = fs.OrderBy(x => x.MatchId).ToList(); // sort by MatchId
            }

            return fs;
        }
        private string ConvertToTwelveHour(string date, string strTime, bool hasPlusSign)
        {
            string t = strTime;
            string twelveHour = "";

            if (hasPlusSign)
            {
                string deleteAfterComma = t.Split('+')[0].Trim();
                int[] times = Array.ConvertAll(deleteAfterComma.Split(':'), int.Parse);
                int[] dates = Array.ConvertAll(date.Split('-'), int.Parse);

                var dateTime = new DateTime(dates[0], dates[1], dates[2], times[0], times[1], times[2]);
                twelveHour = dateTime.ToString("h:mm tt"); // Ex: 5:30 PM
            }
            else
            {
                int[] times = Array.ConvertAll(t.Split(':'), int.Parse);
                int[] dates = Array.ConvertAll(date.Split('-'), int.Parse);

                var dateTime = new DateTime(dates[0], dates[1], dates[2], times[0], times[1], 00);
                twelveHour = dateTime.ToString("h:mm tt"); // Ex: 5:30 PM
            }

            return twelveHour;
        }
        private string CalculateUtcTimeDifference(string strTime, DateTime dateTimeUTC, string date, string league)
        {           
            string twelveHour = "";
            var gameStartTime = new DateTime();
            double timeSpan = 0;   
           
            // Ex: 20:00+00:00 or 18:00:00+00:00
            if (strTime.Contains("+"))
            {
                // all soccer leagues
                twelveHour = ConvertToTwelveHour(date, strTime, true);
                gameStartTime = DateTime.Parse(date + " " + twelveHour);
                timeSpan = new TimeSpan(gameStartTime.Ticks - dateTimeUTC.Ticks).TotalSeconds;
            }
            // Ex: 16:40:00
            if (!strTime.Contains("+"))
            {
                //mlb    
                twelveHour = ConvertToTwelveHour(date, strTime, false);
                gameStartTime = DateTime.Parse(date + " " + twelveHour);
                timeSpan = new TimeSpan(gameStartTime.Ticks - dateTimeUTC.Ticks).TotalSeconds;
            }

            return timeSpan.ToString();
        }        
        private string ChangeLeagueName(string league)
        {
            switch(league.ToLower())
            {
                case "english premier league":
                    league = "EPL";
                    break;
                case "german bundesliga":
                    league = "Bundesliga";
                    break;
                case "spanish la liga":
                    league = "La Liga";
                    break;
                case "italian serie a":
                    league = "Serie A";
                    break;     
                case "american major league soccer":
                    league = "MLS";
                    break;
                case "mlb":
                    league = "MLB";
                    break;
            }

            return league;
        }
        #endregion
    }
}
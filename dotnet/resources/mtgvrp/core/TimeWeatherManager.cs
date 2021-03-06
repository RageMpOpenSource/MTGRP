using System;
using System.Net;
using System.Text.RegularExpressions;
using System.Timers;

using GTANetworkAPI;
using NodaTime;

namespace mtgvrp.core
{
    public class TimeWeatherManager : Script
    {
        private Timer _weatherTimeTimer;

        public TimeWeatherManager()
        {
        }

        [ServerEvent(Event.PlayerConnected)]
        public void OnPlayerConnected(Player player)
        {
            NAPI.Player.FreezePlayerTime(player, true);
        }

        [ServerEvent(Event.ResourceStop)]
        public void OnResourceStop()
        {
            _weatherTimeTimer.Stop();
            NAPI.Util.ConsoleOutput("Unload Weather Module.");
        }

        [ServerEvent(Event.ResourceStart)]
        public void OnResourceStart()
        {
            NAPI.Util.ConsoleOutput("Loading Weather Module.");

            //Set proper current time
            var time = CurrentTime;
            Minutes = Math.Abs(time.Minute - 30);
            Hours = Math.Abs(time.Hour - 12);

            WeatherTimeTimer_Elapsed(this, null);

            _weatherTimeTimer = new Timer(60000);
            _weatherTimeTimer.Elapsed += WeatherTimeTimer_Elapsed;
            _weatherTimeTimer.AutoReset = true;
            _weatherTimeTimer.Start();

            NAPI.Util.ConsoleOutput("Weather Updated To LA.");
        }

        private int _elapsedMinutes = 30; //To update weather on launch.
        public static int Minutes;
        public static int Hours;
        private void WeatherTimeTimer_Elapsed(object sender, ElapsedEventArgs e)
        {
            _elapsedMinutes += 1;

            //Update time first.
            Minutes += 2;
            if (Minutes >= 60)
            {
                Minutes = 0;
                Hours++;
                if (Hours >= 24)
                {
                    Hours = 0;
                }
            }

            NAPI.Task.Run(() =>
            {
                NAPI.World.SetTime(Hours, Minutes, 0);
            });
            

            //Update weather
            /*if (_elapsedMinutes >= 30)
            {
                _elapsedMinutes = 0;
                WebClient client = new WebClient();
                string reply = String.Empty;
                try
                {
                    reply =
                        client.DownloadString(
                            "https://api.apixu.com/v1/current.json?key=2e4a0092a177439cab8165133172805&q=Los%20Angeles");
                }
                catch (WebException ex)
                {
                    NAPI.Util.ConsoleOutput("Weather API Exception: " + ex.Status);
                }
                Match result = Regex.Match(reply, "\\{.*\\\"code\\\":([0-9]+)\\}");
                if (result.Success)
                {
                    int code = Convert.ToInt32(result.Groups[1].Value);
                    //Check and apply.
                    switch (code)
                    {
                        case 1000:
                            NAPI.World.SetWeather(0);
                            break;
                        case 1003:
                            NAPI.World.SetWeather((Weather)1);
                            break;
                        case 1006:
                            NAPI.World.SetWeather((Weather)2);
                            break;
                        case 1009:
                            NAPI.World.SetWeather((Weather)5);
                            break;
                        case 1030:
                        case 1135:
                        case 1147:
                            NAPI.World.SetWeather((Weather)4);
                            break;
                        case 1063:
                        case 1072:
                        case 1150:
                        case 1153:
                        case 1168:
                        case 1171:
                        case 1180:
                        case 1183:
                        case 1186:
                        case 1189:
                        case 1198:
                        case 1204:
                        case 1240:
                        case 1249:
                            NAPI.World.SetWeather((Weather)8);
                            break;
                        case 1066:
                        case 1069:
                        case 1210:
                        case 1216:
                        case 1255:
                        case 1261:
                            NAPI.World.SetWeather((Weather)10);
                            break;
                        case 1087:
                        case 1273:
                        case 1276:
                        case 1279:
                        case 1282:
                            NAPI.World.SetWeather((Weather)7);
                            break;
                        case 1114:
                            NAPI.World.SetWeather((Weather)11);
                            break;
                        case 1117:
                        case 1213:
                        case 1219:
                        case 1222:
                        case 1225:
                        case 1237:
                        case 1258:
                        case 1264:
                            NAPI.World.SetWeather((Weather)12);
                            break;
                        case 1192:
                        case 1195:
                        case 1201:
                        case 1207:
                        case 1243:
                        case 1246:
                        case 1252:
                            NAPI.World.SetWeather((Weather)6);
                            break;
                    }
                    NAPI.Util.ConsoleOutput("Set Weather To " + NAPI.World.GetWeather());
                }
            }*/
        }

        //Los Angeles Time.
        public static DateTime CurrentTime
        {
            get
            {
                DateTimeZone zone = DateTimeZoneProviders.Tzdb["America/Los_Angeles"];
                Instant now = SystemClock.Instance.GetCurrentInstant();
                ZonedDateTime pacificNow = now.InZone(zone);
                return pacificNow.ToDateTimeUnspecified();
            }
        }
    }
}

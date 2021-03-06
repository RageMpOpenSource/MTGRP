using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GTANetworkAPI;
namespace mtgvrp.core
{
    public class ObjectRemoval : Script
    {
        private Timer _timer;
        public ObjectRemoval()
        {
            _timer = new Timer((state) =>
            {
                NAPI.Task.Run(() =>
                {
                    foreach (var player in NAPI.Pools.GetAllPlayers())
                    {
                        if (player == null)
                            continue;

                        foreach (var obj in _objects)
                        {
                            if (player.Position.DistanceTo(obj[0]) <= 175.0f)
                            {
                                NAPI.Player.DeletePlayerWorldProp(player, obj[0], obj[1], 50.0f);
                            }
                        }
                    }
                });

            }, null, 1000, 1000);
        }

        private static List<dynamic[]> _objects = new List<dynamic[]>();

        public static void RegisterObject(Vector3 position, int hash)
        {
            _objects.Add(new dynamic[] {position, hash});
        }

        public static void UnregisterObject(Vector3 pos, int hash)
        {
            _objects.RemoveAll(x => x[0] == pos && x[1] == hash);
        }
    }
}

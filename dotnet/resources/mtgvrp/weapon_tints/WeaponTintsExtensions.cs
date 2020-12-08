using GTANetworkAPI;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace mtgvrp.weapon_tints
{
    public static class WeaponTintsExtensions
    {
        public static void SetWeaponTint(this Player player, WeaponHash hash, WeaponTint index)
        {
            if (!player.HasData("weaponTints"))
                player.SetData("weaponTints", new Dictionary<uint, int>());

            Dictionary<uint, int> currentTints = player.GetData<Dictionary<uint, int>>("weaponTints");
            currentTints[(uint)hash] = (int)index;
            player.SetData("weaponTints", currentTints);
            player.SetSharedData("weaponTints", JsonConvert.SerializeObject(currentTints));
            if (player.CurrentWeapon == hash)
                player.SetSharedData("currentWeaponTint", $"{Convert.ToString((uint)hash, 36)}|{index}");
        }

        public static int GetWeaponTint(this Player player, WeaponHash hash)
        {
            if (!player.HasData("weaponTints"))
                player.SetData("weaponTints", new Dictionary<uint, int>());
            Dictionary<uint, int> currentTints = player.GetData<Dictionary<uint, int>>("weaponTints");
            return currentTints[(uint)hash];
        }

        public static Dictionary<uint, int> GetAllWeaponTints(this Player player)
        {
            if (!player.HasData("weaponTints"))
                player.SetData("weaponTints", new Dictionary<uint, int>());
            Dictionary<uint, int> currentTints = player.GetData<Dictionary<uint, int>>("weaponTints");
            return currentTints;
        }

        public static void ResetAllWeaponTints(this Player player)
        {
            if (!player.HasData("weaponTints"))
                player.SetData("weaponTints", new Dictionary<uint, int>());
            Dictionary<uint, int> currentTints = player.GetData<Dictionary<uint, int>>("weaponTints");
            if(currentTints.ContainsKey((uint)player.CurrentWeapon))
                player.SetSharedData("currentWeaponTint", $"{Convert.ToString((uint)player.CurrentWeapon, 36)}|0");
            player.ResetData("weaponTints");
        }
    }

    public class WeaponTintsScript : Script
    {
        [ServerEvent(Event.PlayerWeaponSwitch)]
        public void OnPlayerWeaponSwitch(Player player, WeaponHash oldWeapon, WeaponHash newWeapon)
        {
            if (!player.HasData("weaponTints"))
                player.SetData("weaponTints", new Dictionary<uint, int>());
            Dictionary<uint, int> currentTints = player.GetData<Dictionary<uint, int>>("weaponTints");
            int tint = currentTints.ContainsKey((uint)newWeapon) ? currentTints[(uint)newWeapon] : 0;
            player.SetSharedData("currentWeaponTint", $"{Convert.ToString((uint)newWeapon, 36)}|{tint}");
        }
    }
}
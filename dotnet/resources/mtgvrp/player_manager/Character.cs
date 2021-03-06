using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Timers;


using GTANetworkAPI;



using mtgvrp.core;
using mtgvrp.database_manager;
using mtgvrp.group_manager;
using mtgvrp.group_manager.lspd;
using mtgvrp.inventory;
using mtgvrp.job_manager;
using mtgvrp.job_manager.fisher;
using mtgvrp.job_manager.taxi;
using mtgvrp.vehicle_manager;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using Object = GTANetworkAPI.Object;
using GameVehicle = mtgvrp.vehicle_manager.GameVehicle;

namespace mtgvrp.player_manager
{
    public class Character : IStorage
    {
        public static readonly Character None = new Character();

        [BsonIgnore]
        public static int GenderMale = 0;
        [BsonIgnore]
        public static int GenderFemale = 1;

        public int Id { get; set; }
        public string AccountId { get; set; }

        public string CharacterName { get; set; }
        public bool IsCreated { get; set; }

        public Model Model = new Model();

        public Vector3 LastPos { get; set; }
        public Vector3 LastRot { get; set; }
        public int LastDimension { get; set; }

        public int BankBalance { get; set; }

        public PedHash Skin { get; set; }
        public bool HasSkin { get; set; }
        public int Health { get; set; }
        public int Armor { get; set; }
        public int TempHealth { get; set; }

        public List<int> Outfit = new List<int>();
        public List<int> OutfitVariation = new List<int>();

        public int Age { get; set; }
        public string Birthday { get; set; }
        public string Birthplace { get; set; }

        public string PlayerCrimes { get; set; }

        [BsonIgnore]
        public Player Player { get; set; }

        [BsonIgnore]
        public GameVehicle LastVehicle { get; set; }

        [BsonIgnore]
        public bool TaxiDuty = false;

        //Reports
        public bool IsOnAsk { get; set; }
        public bool HasActiveAsk { get; set; }
        public bool HasActiveReport { get; set; }
        public bool ReportCreated { get; set; }

        [BsonIgnore]
        public Timer ReportTimer { get; set; }
        public double ReportMuteExpires { get; set; }

        //Jobs
        public int JobOneId { get; set; }

        [BsonIgnore]
        public Job JobOne { get; set; }

        //Playing time
        [BsonIgnore]
        private long TimeLoggedIn { get; set; }

        public long TimePlayed { get; set; }

        //AME 
        [BsonIgnore]
        public Entity AmeText { get; set; }

        [BsonIgnore]
        public Timer AmeTimer { get; set; }

        //Chat cooldowns
        [BsonIgnore]
        public long NewbieCooldown { get; set; }
        public bool NewbieToggled { get; set; }
        public bool VIPToggled { get; set; }

        [BsonIgnore]
        public long OocCooldown { get; set; }

        //Chat mutes
        public double NMutedExpiration { get; set; }
        public double VMutedExpiration { get; set; }
        [BsonIgnore] public Timer NMutedTimer { get; set; }
        [BsonIgnore] public Timer VMutedTimer { get; set; }

        //Job zone related
        [BsonIgnore]
        public int JobZone { get; set; }

        [BsonIgnore]
        public int JobZoneType { get; set; }

        //Garbage Related

        [BsonIgnore]
        public DateTime CanPickupTrash { get; set; }
        [BsonIgnore]
        public bool IsOnGarbageRun { get; set; }
        [BsonIgnore] public Timer GarbageTimeLeftTimer { get; set; }
        private int _garbagetime;


        //Drug levels

         public int HeroinTolerance { get; set; }
        [BsonIgnore]
         public Timer WeedTimer { get; set; }
        [BsonIgnore]
        public Timer Speedtimer { get; set; }
        [BsonIgnore]
        public Timer HeroinTimer { get; set; }
        [BsonIgnore]
        public Timer CocaineTimer { get; set; }
        [BsonIgnore]
        public Timer MethTimer { get; set; }

        public int GarbageTimeLeft
        {
            get { return _garbagetime; }
            set
            {
                if (Player != null)
                    API.Shared.TriggerClientEvent(Player, "update_garbage_time", value / 1000);

                _garbagetime = value;
            }
        }

        //Taxi Related
        [BsonIgnore]
        public Character TaxiPassenger { get; set; }

        [BsonIgnore]
        public Character TaxiDriver { get; set; }

        public int TaxiFare { get; set; }

        [BsonIgnore]
        public Vector3 TaxiStart { get; set; }

        [BsonIgnore]
        public int TotalFare { get; set; }

        [BsonIgnore]
        public Timer TaxiTimer { get; set; }

        //Fisherman Related
        [BsonIgnore]
        public bool IsInFishingZone { get; set; }

        [BsonIgnore]
        public DateTime NextFishTime { get; set; }

        [BsonIgnore]
        public Timer CatchTimer { get; set; }

        [BsonIgnore]
        public Fish CatchingFish { get; set; }

        [BsonIgnore]
        public int PerfectCatchStrength { get; set; }

        public Dictionary<Fish, int> FishOnHand = new Dictionary<Fish, int>();

        public int TrasureFound { get; set; }
        public double CanScuba { get; set; }
        //Mechanic related
        public double FixcarPrevention { get; set; }

        //Gunrunner Related

        public bool IsGunrunner { get; set; }
        public int Renown { get; set; }
        [BsonIgnore]
        public Container Container { get; set; }
        public int WeaponsSold { get; set; }
        public int WeaponsBought { get; set; }
        public double WeaponSellTimeLimit { get; set; }
        public double InterveneTimeLimit { get; set; }
        public int TotalWeaponsSold { get; set; }

        //Phone
        [BsonIgnore]
        public Character InCallWith { get; set; }
        [BsonIgnore]
        public Character BeingCalledBy { get; set; }
        [BsonIgnore]
        public Character CallingPlayer { get; set; }
        [BsonIgnore]
        public System.Threading.Timer CallingTimer;

        //Dropcar
        public bool IsOnDropcar { get; set; }
        public double DropcarReset { get; set; }

        [BsonIgnore]
        public bool Calling911 { get; set; }

        //Groups
        public int GroupId { get; set; }
        public int GroupRank { get; set; }
        public int Division { get; set; }
        public int DivisionRank { get; set; }

        // NEW groups (keeping old for now)
        public int DivisionId { get; set; }
        public int RankId { get; set; }

        // NEW Jail
        public int InJailId { get; set; } // the jail id you are in. 
        public int InJailCellPosition { get; set; } // the jail cell you are in. 

        [BsonIgnore]
        public Group Group { get; set; }

        [BsonIgnore]
        public Group LockerZoneGroup { get; set; }

        //LSPD Related
        public bool IsInPoliceUniform { get; set; }
        public bool IsOnPoliceDuty { get; set; }
        public string BadgeNumber { get; set; }
        public Vector3 BeaconPosition { get; set; }
        public bool BeaconSet { get; set; }
        [BsonIgnore] public Timer BeaconTimer { get; set; }
        [BsonIgnore] public Timer BeaconResetTimer { get; set; }
        public Player BeaconCreator { get; set; }


        [BsonIgnore] public Timer aJailTimeLeftTimer { get; set; }
        [BsonIgnore] public Timer aJailTimer { get; set; }
        public bool isAJailed { get; set; }
        public int _atime;
        public int aJailTimeLeft
        {
            get => _time;
            set
            {
                if(Player != null)
                    API.Shared.TriggerClientEvent(Player,"update_jail_time",value/1000);
                _time = value;
            }
        }

        [BsonIgnore]
        public bool IsViewingMdc { get; set; }

        private int _time;

        [BsonIgnore] public Timer JailTimeLeftTimer { get; set; }
        [BsonIgnore] public Timer JailTimer { get; set; }
        public bool IsJailed { get; set; }
        public int SentTicketAmount { get; set; }

        public int JailTimeLeft
        {
            get { return _time; }
            set
            {
                if (Player != null)
                    API.Shared.TriggerClientEvent(Player, "update_jail_time", value/1000);

                _time = value;
            }
        }

        [BsonIgnore] public Timer TicketTimer { get; set; }
        public bool SentTicket { get; set; }
        public int TicketBalance { get; set; }
        public int UnpaidTickets { get; set; }
        public bool RadioToggle { get; set; }

        //LSNN Related
        public bool IsWatchingBroadcast { get; set; }
        public bool HasMic { get; set; }
        public bool HasLottoTicket { get; set; }
        public bool HasCamera { get; set; }
        //Player Interaction
        [BsonIgnore]
        public Character FollowingPlayer { get; set; }

        [BsonIgnore]
        public bool IsBeingDragged { get; set; }

        [BsonIgnore]
        public Timer FollowingTimer { get; set; }

        [BsonIgnore]
        public bool AreHandsUp { get; set; }

        public bool IsCuffed { get; set; }

        public List<IInventoryItem> Inventory { get; set; }

        [BsonIgnore]
        public bool CanDoAnim { get; set; }

        [BsonIgnore]
        public int MaxInvStorage => 200;

        [BsonIgnore]
        public bool IsTied;

        [BsonIgnore]
        public bool IsBlindfolded;

        [BsonIgnore]
        public bool IsRagged;

        [BsonIgnore]
        public DateTime NextHotWire;

        [BsonIgnore]
        public bool IsScubaDiving = false;

        public enum TruckingStages
        {
            None,
            GettingTrailer,
            HeadingForWoodSupplies,
            HeadingForFuelSupplies,
            DeliveringWood,
            DeliveringFuel,
            HeadingBack
        }
        [BsonIgnore]
        public TruckingStages TruckingStage = TruckingStages.None;

        //Hunting Related
        public DateTime LastRedeemedDeerTag;
        public DateTime LastRedeemedBoarTag;

        //DMV
        [BsonIgnore] public DateTime TimeStartedDmvTest;
        [BsonIgnore] public bool IsInDmvTest;

        [BsonIgnore]
        public int AfkTimer;

        public Character()
        {
            Id = 0;
            AccountId = "none";
            IsCreated = false;
            CharacterName = "Default_Name";

            LastPos = new Vector3(0.0, 0.0, 0.0);
            LastRot = new Vector3(0.0, 0.0, 0.0);

            BankBalance = 0;

            Skin = PedHash.FreemodeMale01;

            Player = null;

            LastVehicle = null;

            JobOne = Job.None;

            TaxiFare = TaxiJob.MinFare;
            TaxiPassenger = null;
            TaxiDriver = null;

            IsInFishingZone = false;
            CatchingFish = Fish.None;

            Group = Group.None;

            FollowingPlayer = Character.None;

            InCallWith = Character.None;
            BeingCalledBy = Character.None;
            CallingPlayer = Character.None;

            Health = 100;
            Armor = 0;
            TempHealth = 0;
            HeroinTolerance = 0;

            RadioToggle = true;
            CanDoAnim = true;

            IsOnGarbageRun = false;

            Container = null;
        }

        public void Insert()
        {
            Task.Run(() =>
            {
                Id = DatabaseManager.GetNextId("characters");
                DatabaseManager.CharacterTable.InsertOne(this);
            });
        }

        public void Save()
        {
            if (Player != null)
            {
                Health = API.Shared.GetPlayerHealth(Player);
                Armor = API.Shared.GetPlayerArmor(Player);
                Skin = (PedHash) Player.Model;
                LastPos = Player.Position;
                LastRot = Player.Rotation;

                GetTimePlayed(); //Update time played before save.
            }
            var task = Task.Run(() =>
            {
                LogManager.Log(LogManager.LogTypes.Connection,
                    $"Trying to save character {this.CharacterName} with ID {Id}.");

                var filter = Builders<Character>.Filter.Eq("_id", Id);
                var res = DatabaseManager.CharacterTable.ReplaceOne(filter, this);
                if (!res.IsAcknowledged || (res.IsModifiedCountAvailable && res.ModifiedCount == 0))
                {
                    LogManager.Log(LogManager.LogTypes.Connection,
                        $"Character {this.CharacterName} ERRORED while saving.");
                }
            });

            task.ContinueWith(
                a => LogManager.Log(LogManager.LogTypes.Connection,
                    $"The character {CharacterName} was saved sucessfully."),
                TaskContinuationOptions.OnlyOnRanToCompletion);

            task.ContinueWith(
                a => LogManager.Log(LogManager.LogTypes.Connection,
                    $"The character {CharacterName} was NOT saved sucessfully. {a.Exception?.Flatten().ToString()}"),
                TaskContinuationOptions.OnlyOnFaulted);
        }

        public List<GameVehicle> OwnedVehicles => VehicleManager.Vehicles.Where(x => x.OwnerId == Id).ToList();

        public static bool IsCharacterRegistered(string name)
        {
            var filter = Builders<Character>.Filter.Eq("CharacterName", name);

            if (DatabaseManager.CharacterTable.Find(filter).CountDocuments() > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public void update_ped()
        {
            update_ped(Player);
            foreach (var p in API.Shared.GetAllPlayers())
            {
                if (p == null)
                    return;

                if (p.Position.DistanceTo(Player.Position) <= 500f)
                {
                    update_ped(p);
                }
            }
        }

        public void update_ped(Player player)
        {
            NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_HEAD_BLEND_DATA, Player, Model.FatherId,
                Model.MotherId, 0, Model.FatherId, Model.MotherId, 0, Model.ParentLean, Model.ParentLean, 0, false);

            NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_COMPONENT_VARIATION, Player, 2, Model.HairStyle, 0, 0);
            NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_COMPONENT_VARIATION, Player, 2, Model.HairStyle, 0, 0);
            NAPI.Native.SendNativeToPlayer(player, Hash._SET_PED_HAIR_COLOR, Player, Model.HairColor);

            //NAPI.Native.SendNativeToPlayer(player, Hash._SET_PED_EYE_COLOR, client, this.model.eye_color);

            NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_HEAD_OVERLAY, Player, 2, Model.Eyebrows, 1.0f);
            NAPI.Native.SendNativeToPlayer(player, Hash._SET_PED_HEAD_OVERLAY_COLOR, Player, 2, 1, Model.HairColor,
                Model.HairColor);

            NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_HEAD_OVERLAY, Player, 0, Model.Blemishes, 1.0f);

            NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_HEAD_OVERLAY, Player, 1, Model.FacialHair, 1.0f);
            NAPI.Native.SendNativeToPlayer(player, Hash._SET_PED_HEAD_OVERLAY_COLOR, Player, 1, 1, Model.HairColor,
                Model.HairColor);

            NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_HEAD_OVERLAY, Player, 3, Model.Ageing, 1.0f);

            NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_HEAD_OVERLAY, Player, 8, Model.Lipstick, 1.0f);
            NAPI.Native.SendNativeToPlayer(player, Hash._SET_PED_HEAD_OVERLAY_COLOR, Player, 8, 2, Model.LipstickColor,
                Model.LipstickColor);

            NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_HEAD_OVERLAY, Player, 4, Model.Makeup, 1.0f);
            NAPI.Native.SendNativeToPlayer(player, Hash._SET_PED_HEAD_OVERLAY_COLOR, Player, 4, 0, Model.MakeupColor,
                Model.MakeupColor);

            NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_HEAD_OVERLAY, Player, 5, Model.Blush, 1.0f);
            NAPI.Native.SendNativeToPlayer(player, Hash._SET_PED_HEAD_OVERLAY_COLOR, Player, 5, 2, Model.BlushColor,
                Model.BlushColor);

            NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_HEAD_OVERLAY, Player, 6, Model.Complexion, 1.0f);

            NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_HEAD_OVERLAY, Player, 7, Model.SunDamage, 1.0f);

            NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_HEAD_OVERLAY, Player, 9, Model.MolesFreckles, 1.0f);

            if (IsOnGarbageRun == true)
            {
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_COMPONENT_VARIATION, Player, 4, Model.Gender == GenderMale ? 36 : 35, 0, 0); //Garbage pants
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_COMPONENT_VARIATION, Player, 8, Model.Gender == GenderMale ? 59 : 36, 0, 0); //Garbage vest
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_COMPONENT_VARIATION, Player, 11, Model.Gender == GenderMale ? 56 : 49, 0, 0); //Garbage shirt

                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_COMPONENT_VARIATION, Player, 6, Model.ShoeStyle, Model.ShoeVar - 1, 0); // Shoes
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_COMPONENT_VARIATION, Player, 7, Model.AccessoryStyle, Model.AccessoryVar - 1, 0); // Accessories
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_COMPONENT_VARIATION, Player, 3, 0, 0, 0); //Torso


                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_PROP_INDEX, Player, 1, 0, 0, true);
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_PROP_INDEX, Player, 2, Model.EarStyle,
                    Model.Gender == GenderMale ? 33 : 0, 0, true);
            }
            else if(IsInPoliceUniform == true)
            {
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_COMPONENT_VARIATION, Player, 4, Model.Gender == GenderMale ? 35 : 34, 0, 0); // Pants
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_COMPONENT_VARIATION, Player, 6, 24, 0, 0); // Shoes
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_COMPONENT_VARIATION, Player, 7, 0, 0, 0); // Accessories
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_COMPONENT_VARIATION, Player, 8, Model.Gender == GenderMale ? 58 : 35, 0, 0); //undershirt
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_COMPONENT_VARIATION, Player, 11, Model.Gender == GenderMale ? 55 : 48, 0, 0); //top
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_COMPONENT_VARIATION, Player, 3, 0, 0, 0); //Torso

                //API.Shared.SetPlayerAccessory(client, 0, this.model.hat_style, this.model.hat_var - 1); // hats
                //API.Shared.SetPlayerAccessory(client, 1, this.model.glasses_style, this.model.glasses_var - 1); // glasses
                //API.Shared.SetPlayerAccessory(client, 2, this.model.ear_style, this.model.ear_var - 1); // earings

                //Work around until setPlayerAccessory is fixed.
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_PROP_INDEX, Player, 0,
                    Model.Gender == GenderMale ? 46 : 45, 0, true);
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_PROP_INDEX, Player, 1, Model.Gender == GenderMale ? 0 : 12, 0, true);
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_PROP_INDEX, Player, 2, Model.EarStyle,
                    Model.Gender == GenderMale ? 33 : 0, 0, true);
            }
            else if (HasSkin)
            {
                NAPI.Player.SetPlayerSkin(Player, Skin);
            }
            else
            {
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_COMPONENT_VARIATION, Player, 4, Model.PantsStyle, Model.PantsVar - 1, 0); // Pants
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_COMPONENT_VARIATION, Player, 6, Model.ShoeStyle, Model.ShoeVar - 1, 0); // Shoes
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_COMPONENT_VARIATION, Player, 7, Model.AccessoryStyle, Model.AccessoryVar - 1, 0); // Accessories
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_COMPONENT_VARIATION, Player, 8, Model.UndershirtStyle, Model.UndershirtVar - 1, 0); //undershirt
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_COMPONENT_VARIATION, Player, 11, Model.TopStyle, Model.TopVar - 1, 0); //top
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_COMPONENT_VARIATION, Player, 3, Model.TorsoStyle, Model.TorsoVar, 0); //Torso

                //API.Shared.SetPlayerAccessory(client, 0, this.model.hat_style, this.model.hat_var - 1); // hats
                //API.Shared.SetPlayerAccessory(client, 1, this.model.glasses_style, this.model.glasses_var - 1); // glasses
                //API.Shared.SetPlayerAccessory(client, 2, this.model.ear_style, this.model.ear_var - 1); // earings

                //Work around until setPlayerAccessory is fixed.
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_PROP_INDEX, Player, 0, Model.HatStyle,
                    Model.HatVar - 1, true);
                NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_PROP_INDEX, Player, 1, Model.GlassesStyle,
                    Model.GlassesVar - 1, true);

                if (Model.EarStyle == 255)
                    NAPI.Native.SendNativeToPlayer(player, Hash.CLEAR_PED_PROP, Player, 2);
                else
                    NAPI.Native.SendNativeToPlayer(player, Hash.SET_PED_PROP_INDEX, Player, 2, Model.EarStyle,
                    Model.EarVar - 1, true);
            }
        }

        public void update_nametag()
        {
            NAPI.Player.SetPlayerNametag(Player, CharacterName + " (" + PlayerManager.GetPlayerId(this) + ")");
        }

        public void StartTrackingTimePlayed()
        {
            TimeLoggedIn = new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds();
        }

        public long GetTimePlayed()
        {
            if(TimeLoggedIn > 0)
            {
                TimePlayed += new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds() - TimeLoggedIn;
                StartTrackingTimePlayed();
            }
            return TimePlayed;
        }

        public int GetPlayingHours()
        {
            if(TimeLoggedIn > 0)
            {
                TimePlayed += new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds() - TimeLoggedIn;
                StartTrackingTimePlayed();
            }
            return (int) TimePlayed / 3600;
        }

        public string rp_name()
        {
            return CharacterName.Replace("_", " ");
        }

        //Criminal Records
        public void RecordCrime(string recordingOfficerId, Crime crime)
        {
            var record = new CriminalRecord(this.Id.ToString(), recordingOfficerId, crime, true);
            record.Insert();
        }

        public List<CriminalRecord> GetCriminalRecord(int amountToSkip = 0)
        {
            var filter = Builders<CriminalRecord>.Filter.Eq("CharacterId", Id.ToString());
            return DatabaseManager.CriminalRecordTable.Find(filter).SortByDescending(x => x.DateTime).Skip(amountToSkip).Limit(10).ToList();
        }

        public long GetCrimesNumber()
        {
            var filter = Builders<CriminalRecord>.Filter.Eq("CharacterId", Id.ToString());
            return DatabaseManager.CriminalRecordTable.Find(filter).CountDocuments();
        }

        public int HasActiveCriminalRecord()
        {
            var crimesList = GetCriminalRecord();
            return crimesList.FindAll(c => c.ActiveCrime == true).Count;
        }
    }
}

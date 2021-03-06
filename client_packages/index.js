const nativeui = require('nativeui');
require('GetUserInputAsync.js');

require('core/AttachmentManager.js');
require('core/WeaponTints.js');
// require('rp_scripts/BankMenu.js');
require('player_manager/PlayerManager.js');
// require('player_manager/player_interaction/PlayerInteraction.js');
// require('player_manager/player_list/PlayerList.js');
require('player_manager/login/LoginManager.js');
require('player_manager/CharacterMenu.js');
// require('player_manager/Introduction.js');
// require('job_manager/JobManager.js');
// require('job_manager/taxi/TaxiJob.js');
// require('job_manager/fisher/Fisher.js');
// require('job_manager/garbageman/Garbageman.js');
// require('job_manager/hunting/HuntingManager.js');
// require('vehicle_manager/VehicleManager.js');
// require('vehicle_manager/VehicleMenu.js');
// require('vehicle_manager/vehicle_editor/VehicleEdit.js');
// require('drugs_manager/DrugsClient.js');
// require('group_manager/lspd/MDC/MDC.js');
// require('vehicle_dealership/vehicledealer.js');
// require('vehicle_dealership/vipdealership.js');
// require('vehicle_dealership/chopperdealership.js');
// require('vehicle_manager/VehicleOwnership.js');
// require('vehicle_dealership/boatdealer.js');
// require('inventory/InventoryManager.js');
// require('group_manager/lspd/LspdLocker.js');
// require('group_manager/lspd/Lspd.js');
// require('group_manager/lsnn/Lsnn.js');
// require('phone_manager/PhoneManager.js');
// require('speed_fuel_system/SpeedoFuel.js');
// require('core/JsFunctions.js');
// require('core/MarkerZone.js');
// require('core/Animations.js');
// require('door_manager/DoorManager.js');
// require('core/Items/RagManager.js');
// require('property_system/PropertyManager.js');
// require('property_system/businesses/Clothing.js');
// require('property_system/businesses/GeneralBuying.js');
// require('core/Help/HelpManager.js');
// require('job_manager/lumberjack/Lumberjack.js');
// require('job_manager/scuba/ScubaManager.js');
// require('job_manager/gunrunner/GunrunnerManager.js');
// require('AdminSystem/Reports.js');
// require('dmv/DmvManager.js');
// require('mapping_manager/MappingManager.js');
// require('vehicle_manager/modding/ModdingManager.js');

/** WORKAROUND EVENTS */

mp.events.add('setVehicleDoorState', (vehid, doorid, state) => {
    let veh = mp.vehicles.atRemoteId(vehid);
    if(veh != undefined) {
        if(state == false)
            veh.setDoorShut(doorid, true);
        else
            veh.setDoorOpen(doorid, false, true);
    }
});

mp.events.addProc('getVehicleDoorState', (vehid, doorid) => {
    return mp.vehicles.atRemoteId(vehid).isDoorFullyOpen(doorid);
});

// Register attachable objects!
mp.attachmentMngr.register('MicObject', 'p_ing_microphonel_01', 'IK_R_Hand', new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
mp.attachmentMngr.register('GarbageBag', 'hei_prop_heist_binbag', 'IK_R_Hand', new mp.Vector3(0, 0, 0), new mp.Vector3(360, 0, 0));
mp.attachmentMngr.register('MegaPhoneObject', 'prop_megaphone_01', 'IK_R_Hand', new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));

mp.attachmentMngr.register('ScubaHead', 239157435, 'SKEL_Head', new mp.Vector3(0, 0, 0), new mp.Vector3(180, 90, 0));
mp.attachmentMngr.register('ScubaTank', 1593773001, 'SKEL_Spine3', new mp.Vector3(-0.3, -0.23, 0), new mp.Vector3(180, 90, 0));
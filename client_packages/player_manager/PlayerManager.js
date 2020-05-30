mp.events.add('entityStreamIn', (entity) => {
	if(entity.type == 6 || entity.type == 8){
		mp.events.callRemote('update_ped_for_client', entity);
	}
});

let player_money = null;
let jail_time = 0;
let garbage_timer = 0;
let mark = null;
let carWaypoint = null;

//	maybe use addEventHandler
mp.events.add('update_money_display', (money) => {
	player_money = parseInt(money);
});

mp.events.add('update_jail_time', (jailTime) => {
	jail_time = parseInt(jailTime);
});

mp.events.add('update_garbage_time', (garbageTime) => {
	garbage_timer = parseInt(garbageTime);
});

mp.events.add('dropcar_setwaypoint', (location) => {
	carWaypoint = mp.blips.new(8, location,
	{
		name: 'Drop car',
		shortRange: false,
	});
	carWaypoint.setRoute(true);
	mark = mp.markers.new(1, location, 1, { color: [255, 0, 0, 255] });
});

mp.events.add('dropcar_removewaypoint', () => {
	carWaypoint.setRoute(false);
	carWaypoint.destroy();
	mark.destroy();
})

mp.events.add('render', () => {
	if(player_money != null){	//	This also had '&& !resource.Introduction.isonintro' to compare, unsure what this is
		mp.game.graphics.drawText(`~g~$~w~${player_money}`, [0.8, 0.005], { 
			font: 1, 
			scale: [1.2, 1.2]
		});
	}

	if(jail_time > 0){
		mp.game.graphics.drawText(`~r~JAIL TIME LEFT: ~w~${jail_time}`, [0.5, 0.005], { 
			font: 1, 
			scale: [1.2, 1.2]
		});
	}

	if(garbage_timer > 0){
		mp.game.graphics.drawText(`~r~GARBAGE TIME LEFT: ~w~${garbage_timer}`, [0.5, 0.005], { 
			font: 1, 
			scale: [1.2, 1.2]
		});
	}
});
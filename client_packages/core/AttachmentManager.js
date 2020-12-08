let counter = 0;

mp.attachmentMngr = 
{
	attachments: {},
	
	addFor: function(entity, id)
	{
		if(this.attachments.hasOwnProperty(id))
		{
			if(entity.__attachmentObjects == undefined)
				entity.__attachmentObjects = {};
			if(!entity.__attachmentObjects || !entity.__attachmentObjects.hasOwnProperty(id))
			{
				let attInfo = this.attachments[id];
				
				if(attInfo.isWeapon) {
					let allTints = entity.getVariable('weaponTints');
					try {
						allTints = JSON.parse(allTints);
					} catch { allTints = {}; }

					let tintIdx = 0;
					if(allTints.hasOwnProperty(attInfo.model))
						tintIdx = allTints[attInfo.model];
					
					mp.game.weapon.requestWeaponAsset(attInfo.model, 0, 0);
					while (!mp.game.weapon.hasWeaponAssetLoaded(attInfo.model)) {
						mp.game.wait(0);
						counter ++;
						if(counter >= 30) {
							counter = 0;
							break;
						}
					}
					let obj = mp.game.weapon.createWeaponObject(attInfo.model, 0, entity.position.x, entity.position.y, entity.position.z, true, 0, 0);
					mp.game.weapon.setWeaponObjectTintIndex(obj, tintIdx);
					mp.game.invoke("0x6B9BBD38AB0796DF", obj, entity.handle, (typeof(attInfo.boneName) === 'string') ? entity.getBoneIndexByName(attInfo.boneName) : entity.getBoneIndex(attInfo.boneName), attInfo.offset.x, attInfo.offset.y, attInfo.offset.z, attInfo.rotation.x, attInfo.rotation.y, attInfo.rotation.z, false, false, false, false, 2, true);
	
					entity.__attachmentObjects[id] = obj;

				} else {
					let object = mp.objects.new(attInfo.model, entity.position, {
						dimension: -1
					});
					let ev = new mp.Event("entityStreamIn", (ent) => {
						if(ent == object) {
							ent.attachTo(entity.handle,
								(typeof(attInfo.boneName) === 'string') ? entity.getBoneIndexByName(attInfo.boneName) : entity.getBoneIndex(attInfo.boneName),
								attInfo.offset.x, attInfo.offset.y, attInfo.offset.z, 
								attInfo.rotation.x, attInfo.rotation.y, attInfo.rotation.z, 
								false, false, false, false, 2, true);
							ev.destroy();
						}
					});
					object.notifyStreaming = true;
						
					entity.__attachmentObjects[id] = object;
				}
			}
		}
		else
		{
			mp.game.graphics.notify(`Static Attachments Error: ~r~Unknown Attachment Used: ~w~0x${id.toString(16)}`);
		}
	},
	
	removeFor: function(entity, id)
	{
		if(entity.__attachmentObjects == undefined)
			entity.__attachmentObjects = {};
		if(entity.__attachmentObjects.hasOwnProperty(id))
		{
			let attInfo = this.attachments[id];
			if(attInfo.isWeapon) {
				mp.game.object.deleteObject(entity.__attachmentObjects[id]);
				mp.game.weapon.removeWeaponAsset(attInfo.model);
			} else {
				if(mp.objects.exists(entity.__attachmentObjects[id]))
				{
					entity.__attachmentObjects[id].destroy();
				}
			}
			delete entity.__attachmentObjects[id];
		}
	},
	
	initFor: function(entity)
	{
		for(let attachment of entity.__attachments)
		{
			mp.attachmentMngr.addFor(entity, attachment);
		}
	},
	
	shutdownFor: function(entity)
	{
		if(entity.__attachmentObjects == undefined)
			entity.__attachmentObjects = {};
		for(let attachment in entity.__attachmentObjects)
		{
			mp.attachmentMngr.removeFor(entity, attachment);
		}
	},
	
	register: function(id, model, boneName, offset, rotation, isWeapon = false)
	{
		if(typeof(id) === 'string')
		{
			id = mp.game.joaat(id);
		}
		
		if(typeof(model) === 'string')
		{
			model = mp.game.joaat(model);
		}
		
		if(!this.attachments.hasOwnProperty(id))
		{
			//if(mp.game.streaming.isModelInCdimage(model))
			//{
				this.attachments[id] =
				{
					id: id,
					model: model,
					offset: offset,
					rotation: rotation,
					boneName: boneName,
					isWeapon: isWeapon
				};
			//}
			//else
			//{
			//	mp.game.graphics.notify(`Static Attachments Error: ~r~Invalid Model (0x${model.toString(16)})`);
			//}
		}
		else
		{
			mp.game.graphics.notify("Static Attachments Error: ~r~Duplicate Entry");
		}
	},
	
	unregister: function(id) 
	{
		if(typeof(id) === 'string')
		{
			id = mp.game.joaat(id);
		}
		
		if(this.attachments.hasOwnProperty(id))
		{
			this.attachments[id] = undefined;
		}
	},
	
	addLocal: function(attachmentName)
	{
		if(typeof(attachmentName) === 'string')
		{
			attachmentName = mp.game.joaat(attachmentName);
		}
		
		let entity = mp.players.local;
		
		if(!entity.__attachments || entity.__attachments.indexOf(attachmentName) === -1)
		{
			mp.events.callRemote("staticAttachments.Add", attachmentName.toString(36));
		}
	},
	
	removeLocal: function(attachmentName)
	{
		if(typeof(attachmentName) === 'string')
		{
			attachmentName = mp.game.joaat(attachmentName);
		}
		
		let entity = mp.players.local;
		
		if(entity.__attachments && entity.__attachments.indexOf(attachmentName) !== -1)
		{
			mp.events.callRemote("staticAttachments.Remove", attachmentName.toString(36));
		}
	},
	
	getAttachments: function()
	{
		return Object.assign({}, this.attachments);
	}
};

mp.events.add("entityStreamIn", (entity) =>
{
	if(entity.__attachments)
	{
		mp.attachmentMngr.initFor(entity);
	}
});

mp.events.add("entityStreamOut", (entity) =>
{
	if(entity.__attachmentObjects)
	{
		mp.attachmentMngr.shutdownFor(entity);
	}
});

mp.events.addDataHandler("dimension", (entity, data, oldData) => {
	if(data == mp.players.local.getVariable('dimension')) return;
	if(entity.__attachmentObjects)
    {
        mp.attachmentMngr.shutdownFor(entity);
    }
});

mp.events.addDataHandler("attachmentsData", (entity, data) =>
{
	let newAttachments = (data.length > 0) ? data.split('|').map(att => parseInt(att, 36)) : [];
	
	if(entity.handle !== 0)
	{
		let oldAttachments = entity.__attachments;	
		
		if(!oldAttachments)
		{
			oldAttachments = [];
			entity.__attachmentObjects = {};
		}
		
		// process outdated first
		for(let attachment of oldAttachments)
		{
			if(newAttachments.indexOf(attachment) === -1)
			{
				mp.attachmentMngr.removeFor(entity, attachment);
			}
		}
		
		// then new attachments
		for(let attachment of newAttachments)
		{
			if(oldAttachments.indexOf(attachment) === -1)
			{
				mp.attachmentMngr.addFor(entity, attachment);
			}
		}
	}
	
	entity.__attachments = newAttachments;
});

function InitAttachmentsOnJoin()
{
	mp.players.forEach(_player =>
	{
		let data = _player.getVariable("attachmentsData");
		
		if(data && data.length > 0)
		{
			let atts = data.split('|').map(att => parseInt(att, 36));
			_player.__attachments = atts;
			_player.__attachmentObjects = {};
		}
	});
}

mp.events.add('InitAttachmentsOnJoin', InitAttachmentsOnJoin);
var character_menu = null;
var character_creation_menu = null;

var gender = 0;

var MAX_HAIR_STYLE = 0;
var MAX_HAIR_COLORS = mp.game.invoke("0xE5C0CF872C2AD150", 0); // _GET_NUM_HAIR_COLORSs

var MAX_MAKEUP_COLORS = mp.game.invoke("0xD1F7CA1535D22818", 0); // _GET_NUM_MAKEUP_COLORS
var MAX_BLUSH_COLORS = 33;
var MAX_LIPSTICK_COLORS = 27;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Component (clothing) 
var Component = (function () {
    function Component() {
        this.name = "";
        this.id = 0;
        this.variations = 0;
    }
    return Component;
}());

var hair_list = [];
var hair_ids_list = [];
var legs_list = [];
var shoes_list = [];
var access_list = [];
var undershits_list = [];
var tops_list = [];
var hats_list = [];
var glasses_list = [];
var ears_list = [];

//Create the camera view to watch character creation
var creation_view = mp.cameras.new('default', new mp.Vector3(403, -999.5, -98), new mp.Vector3(0, 0, -15), 40);
creation_view.pointAtCoord(403, -998, -98.5);

var facial_view = mp.cameras.new('default', new mp.Vector3(403, -998, -98.2), new mp.Vector3(0, 0, -15), 40);

mp.events.add('showCharacterSelection', () => {
    var player = mp.players.local;

    character_menu = new nativeui.Menu("Character Selection", "Select a character below", new nativeui.Point(750, 400));

    var char_count = player.getVariable("char_count");

    for (var i = 0; i < char_count; i++) {
        var menu_item = new nativeui.UIMenuItem(player.getVariable("char_name_" + i), player.getVariable("char_info_" + i));
        character_menu.AddItem(menu_item);
    }

    character_menu.Open();
    character_menu.CurrentSelection = 0;

    character_menu.ItemSelect.on(async (item, index) => {
        if (item.Text == "Create new character") {
            mp.gui.chat.push("* Enter your desired character name: ");
            
            var res = false;
            while (res === false) {
                mp.gui.chat.push("Character name must be similar to: ~g~John_Doe~w~.");
                var desiredName = await getUserInputAsync({
                    title: 'Enter your desired character name',
                    maxLength: 64,
                    showMaxLength: true
                });
                if (desiredName === "")
                    return;
                var patt = new RegExp("^[A-Z][a-zA-Z]+_[A-Z][a-zA-Z]+$");
                res = patt.test(desiredName);
            }
            mp.events.callRemote("OnCharacterMenuSelect", item.Text, desiredName);
        }
        else {
            mp.events.callRemote("OnCharacterMenuSelect", item.Text);
        }

    });
});

mp.events.add('show_character_creation_menu', () => {
    mp.players.local.dimension = getRandomInt(1, 5000);
    next_character_creation_step(mp.players.local, 0);
});

mp.events.add('login_finished', () => {
    character_menu.Clear();
    character_menu.Close();
});

mp.events.add('initialize_hair', (mxHairs, hairArr, hairIds) => {
    MAX_HAIR_STYLE = mxHairs;
    hair_list = [];
    hair_ids_list = [];
    var hair_array = hairArr.split(",");
    var hair_ids_array = hairIds.split(",");
    for (var i = 0; i < hair_array.length; i++)
    {
        hair_list.push(hair_array[i]);
    }
    for(var i = 0; i < hair_ids_array.length; i++)
    {
        hair_ids_list.push(hair_ids_array[i]);
    }
});

mp.events.add('initialize_components', (lstData) => {
    var list = JSON.parse(lstData);

    var newList = JSON.parse(list["Legs"]);
    for (var a = 0; a < newList.length; a++) {

        var component = new Component();
        component.name = newList[a][0];
        component.id = newList[a][1];
        component.variations = JSON.parse(newList[a][2]);

        legs_list.push(component);
    }

    newList = JSON.parse(list["Shoes"]);
    for (var a = 0; a < newList.length; a++) {

        var component = new Component();
        component.name = newList[a][0];
        component.id = newList[a][1];
        component.variations = JSON.parse(newList[a][2]);

        shoes_list.push(component);
    }

    newList = JSON.parse(list["Accessories"]);
    for (var a = 0; a < newList.length; a++) {

        var component = new Component();
        component.name = newList[a][0];
        component.id = newList[a][1];
        component.variations = JSON.parse(newList[a][2]);

        access_list.push(component);
    }

    newList = JSON.parse(list["Undershirts"]);
    for (var a = 0; a < newList.length; a++) {

        var component = new Component();
        component.name = newList[a][0];
        component.id = newList[a][1];
        component.variations = JSON.parse(newList[a][2]);

        undershits_list.push(component);
    }

    newList = JSON.parse(list["Tops"]);
    for (var a = 0; a < newList.length; a++) {

        var component = new Component();
        component.name = newList[a][0];
        component.id = newList[a][1];
        component.variations = JSON.parse(newList[a][2]);

        tops_list.push(component);
    }

    newList = JSON.parse(list["Hats"]);
    for (var a = 0; a < newList.length; a++) {

        var component = new Component();
        component.name = newList[a][0];
        component.id = newList[a][1];
        component.variations = JSON.parse(newList[a][2]);

        hats_list.push(component);
    }

    newList = JSON.parse(list["Glasses"]);
    for (var a = 0; a < newList.length; a++) {

        var component = new Component();
        component.name = newList[a][0];
        component.id = newList[a][1];
        component.variations = JSON.parse(newList[a][2]);

        glasses_list.push(component);
    }

    newList = JSON.parse(list["Ears"]);
    for (var a = 0; a < newList.length; a++) {

        var component = new Component();
        component.name = newList[a][0];
        component.id = newList[a][1];
        component.variations = JSON.parse(newList[a][2]);

        ears_list.push(component);
    }
});


var pant_menu = null;
var shoe_menu = null;
var accessory_menu = null;
var undershirt_menu = null;
var top_menu = null;
var hat_menu = null;
var glasses_menu = null;
var ear_menu = null;
var torso_menu = null;

var father_ped = null;
var mother_ped = null;

function next_character_creation_step(player, step) {

    switch (step) {
        case 0: {
            gender = 0;

	        mp.gui.chat.push("~g~Welcome to character creation! Let's begin by choosing your gender and your parents!");

            mp.events.callRemote("initialize_hair", gender);

            var gender_menu_item = null;
            var father_menu_item = null;
            var mother_menu_item = null;
            var parent_lean_menu_item = null;
            var next_menu_item = null;

            var gender_list = [];
            var father_list = [];
            var mother_list = [];
            var parent_lean_list = [];

            //Father IDs: 0-20, 42,43,44
            //Mother IDs: 21-41, 45
            var father_int_id = 0;
            var mother_int_id = 21;
            var parent_lean = 0.5;

            //Set Camera to CharacterCreation
            creation_view.setActive(true);
            mp.game.cam.renderScriptCams(true, false, 0, true, false);

            player.setCoords(403, -997, -100, true, false, false, false);
            player.setRotation(0, 0, 177.2663, 2, true);
			player.dimension = player.getVariable("REG_DIMENSION");
	        player.model = 1885233650;

            //Initiate the lists
            gender_list.push("Male");
            gender_list.push("Female");
            for (var i = 0; i < 11; i++) {
                parent_lean_list.push(i.toString());
            }
            for (var i = 0; i < 24; i++) {
                father_list.push((i + 1).toString());
            }
            for (var i = 0; i < 22; i++) {
                mother_list.push((i + 1).toString());
            }

            //Initalize the menu options
            gender_menu_item = new nativeui.UIMenuListItem("Gender", "Select your characters gender.", new nativeui.ItemsCollection(gender_list), 0);
            father_menu_item = new nativeui.UIMenuListItem("Father", "Select your father.", new nativeui.ItemsCollection(father_list), 0);
            mother_menu_item = new nativeui.UIMenuListItem("Mother", "Select your mother.", new nativeui.ItemsCollection(mother_list), 0);
            parent_lean_menu_item = new nativeui.UIMenuListItem("Parent Lean", "Select towards which parent your traits lean. (0 - 10, Father to Mother)", new nativeui.ItemsCollection(parent_lean_list), 0);
            next_menu_item = new nativeui.UIMenuItem("Next", "Continue onto the next portion of character creation.");

            //Create the display peds and set their info
			if(father_ped !== null)
				father_ped.destroy();
	        if(mother_ped !== null)
		        mother_ped.destroy();

            father_ped = mp.peds.new(1885233650, new mp.Vector3(402.5, -996.5, -99), 172, mp.players.local.dimension);
            mother_ped = mp.peds.new(-1667301416, new mp.Vector3(403.38, -996.5, -99), 172, mp.players.local.dimension);
            mp.events.callRemote("change_parent_info", father_ped, mother_ped, father_int_id, mother_int_id, parent_lean, gender);

			//Set default clothes.
	        /*updateClothes(4, 0, 0);
	        updateClothes(6, 0, 0);
	        updateClothes(11, 0, 0);*/

            //Finish creating the menu
            character_creation_menu = new nativeui.Menu("Character Creation", "Parent Selection", new nativeui.Point(1450, 400));
            character_creation_menu.AddItem(gender_menu_item);
            character_creation_menu.AddItem(father_menu_item);
            character_creation_menu.AddItem(mother_menu_item);
            character_creation_menu.AddItem(parent_lean_menu_item);
            character_creation_menu.AddItem(next_menu_item);

            character_creation_menu.Open();

            character_creation_menu.ItemSelect.on(function (item, index) {
                if (item.Text == "Next") {
                    character_creation_menu.Close();
                    mp.events.callRemote("change_parent_info", father_ped, mother_ped, father_int_id, mother_int_id, parent_lean, gender);
                    next_character_creation_step(player, 1);
                }
            });
            
            character_creation_menu.ListChange.on((listItem, new_index) => {
                if(listItem == gender_menu_item) {
                    if (new_index == 0) {
                        makeup = 255;
                        blush = 255;
                        lipstick = 255;
                        mp.players.local.model = 1885233650;
                    }
                    else {
                        facial_hair = 255;
                        mp.players.local.model = -1667301416;
                    }
                   
                    gender = new_index;
                    mp.events.callRemote("initialize_hair", gender);
                    mp.events.callRemote("change_parent_info", father_ped, mother_ped, father_int_id, mother_int_id, parent_lean, gender);
                } else if(listItem == father_menu_item) {
                    if (new_index < 21) {
                        father_int_id = new_index;
                    }
                    else {
                        switch (new_index) {
                            case 21:
                                father_int_id = 42;
                                break;
                            case 22:
                                father_int_id = 43;
                                break;
                            case 23:
                                father_int_id = 44;
                                break;
                        }
                    }
    
                    mp.game.invoke("0x9414E18B9434C2FE", father_ped.handle, father_int_id, father_int_id, 0, father_int_id, father_int_id, 0, 1.0, 1.0, 0, false); //SET_PED_HEAD_BLEND_DATA
                    mp.game.invoke("0x9414E18B9434C2FE", mother_ped.handle, mother_int_id, mother_int_id, 0, mother_int_id, mother_int_id, 0, 1.0, 1.0, 0, false); //SET_PED_HEAD_BLEND_DATA
                    mp.game.invoke("0x9414E18B9434C2FE", mp.players.local.handle, father_int_id,
                        mother_int_id, 0, father_int_id, mother_int_id, 0, parent_lean, parent_lean, 0, false);
                } else if(listItem == mother_menu_item) {
                    if (new_index < 21) {
                        mother_int_id = new_index + 21;
                    }
                    else {
                        mother_int_id = 45;
                    }
    
                    mp.game.invoke("0x9414E18B9434C2FE", father_ped.handle, father_int_id, father_int_id, 0, father_int_id, father_int_id, 0, 1.0, 1.0, 0, false); //SET_PED_HEAD_BLEND_DATA
                    mp.game.invoke("0x9414E18B9434C2FE", mother_ped.handle, mother_int_id, mother_int_id, 0, mother_int_id, mother_int_id, 0, 1.0, 1.0, 0, false); //SET_PED_HEAD_BLEND_DATA
                    mp.game.invoke("0x9414E18B9434C2FE", mp.players.local.handle, father_int_id,
                        mother_int_id, 0, father_int_id, mother_int_id, 0, parent_lean, parent_lean, 0, false);
                } else if(listItem == parent_lean_menu_item) {
                    switch (new_index) {
                        case 0:
                            parent_lean = 0.01;
                            break;
                        case 1:
                            parent_lean = 0.1;
                            break;
                        case 2:
                            parent_lean = 0.2;
                            break;
                        case 3:
                            parent_lean = 0.3;
                            break;
                        case 4:
                            parent_lean = 0.4;
                            break;
                        case 5:
                            parent_lean = 0.5;
                            break;
                        case 6:
                            parent_lean = 0.6;
                            break;
                        case 7:
                            parent_lean = 0.7;
                            break;
                        case 8:
                            parent_lean = 0.8;
                            break;
                        case 9:
                            parent_lean = 0.9;
                            break;
                        case 10:
                            parent_lean = 1.01;
                            break;
                    }
    
                    mp.game.invoke("0x9414E18B9434C2FE", father_ped, father_int_id, father_int_id, 0, father_int_id, father_int_id, 0, 1.0, 1.0, 0, false); // SET_PED_HEAD_BLEND_DATA
                    mp.game.invoke("0x9414E18B9434C2FE", mother_ped, mother_int_id, mother_int_id, 0, mother_int_id, mother_int_id, 0, 1.0, 1.0, 0, false); // SET_PED_HEAD_BLEND_DATA
                    mp.game.invoke("0x9414E18B9434C2FE", mp.players.local, father_int_id,
                        mother_int_id, 0, father_int_id, mother_int_id, 0, parent_lean, parent_lean, 0, false);
                }
            });
            break;
        }
        case 1: {
            mp.events.callRemote("initiate_style_limits", gender);

            mp.gui.chat.push("~g~Alright, now that we have figured out your parents let us see what your face looks like!");
            mp.gui.chat.push("~g~NOTE: You can use the PLUS and MINUS keys to rotate your character!");

            player = mp.players.local;
            character_creation_menu.Close();

            facial_view.pointAtPedBone(player.handle, 65068, 0, 0, 0, true);
            facial_view.setActive(true);
            mp.game.cam.renderScriptCams(true, false, 0, true, false);

            var hair_style = 0;
            var hair_color = 0;
            var facial_hair = 255; 
            var blemishes = 255;
            var eyebrows = 0;
            var ageing = 255;
            var makeup = 255;
            var makeup_color = 0;
            var blush = 255;
            var blush_color = 0;
            var complexion = 255;
            var sun_damage = 255;
            var lipstick = 255;
            var lipstick_color = 0;
            var moles_freckles = 255;

            var hair_style_list = [];
            var hair_color_list = [];
            var facial_hair_list = [];
            var blemishes_list = [];
            var eyebrow_list = [];
            var ageing_list = [];
            var makeup_list = [];
            var makeup_color_list = [];
            var blush_list = [];
            var blush_color_list = [];
            var lipstick_list = [];
            var lipstick_color_list = [];
            var complexion_list = [];
            var sundamage_list = [];
            var moles_freckles_list = [];

            /*for (var i = 0; i < MAX_HAIR_STYLE; i++) {
                hair_style_list.Add((i + 1).toString());
            }*/
            for (var i = 0; i < MAX_HAIR_COLORS; i++) {
                hair_color_list.push((i + 1).toString());
            }
            facial_hair_list.push("None");
            for (var i = 0; i < 29; i++) {
                facial_hair_list.push((i + 1).toString());
            }
            blemishes_list.push("None");
            for (var i = 0; i < 24; i++) {
                blemishes_list.push((i + 1).toString());
            }
            for (var i = 0; i < 34; i++) {
                eyebrow_list.push((i + 1).toString());
            }
            ageing_list.push("None");
            for (var i = 0; i < 15; i++) {
                ageing_list.push((i + 1).toString());
            }
            makeup_list.push("None");
            for (var i = 0; i < 75; i++) {
                makeup_list.push((i + 1).toString());
            }
            for (var i = 0; i < MAX_MAKEUP_COLORS; i++) {
                makeup_color_list.push((i + 1).toString());
            }
            blush_list.push("None");
            for (var i = 0; i < 7; i++) {
                blush_list.push((i + 1).toString());
            }
            for (var i = 0; i < MAX_BLUSH_COLORS; i++) {
                blush_color_list.push((i + 1).toString());
            }
            blush_list.push("None");
            for (var i = 0; i < 10; i++) {
                lipstick_list.push((i + 1).toString());
            }
            for (var i = 0; i < MAX_LIPSTICK_COLORS; i++) {
                lipstick_color_list.push((i + 1).toString());
            }
            complexion_list.push("None");
            for (var i = 0; i < 12; i++) {
                complexion_list.push((i + 1).toString());
            }
            sundamage_list.push("None");
            for (var i = 0; i < 11; i++) {
                sundamage_list.push((i + 1).toString());
            }
            moles_freckles_list.push("None");
            for (var i = 0; i < 18; i++) {
                moles_freckles_list.push((i + 1).toString());
            }

            var hair_style_menu_item = new nativeui.UIMenuListItem("Hair Style", "Select a hair style.", new nativeui.ItemsCollection(hair_list), 0);
            var hair_color_menu_item = new nativeui.UIMenuListItem("Hair Color", "Select a hair color.", new nativeui.ItemsCollection(hair_color_list), 0);
            var blemishes_menu_item = new nativeui.UIMenuListItem("Blemishes", "Select any blemishes style.", new nativeui.ItemsCollection(blemishes_list), 0);
            var eyebrow_menu_item = new nativeui.UIMenuListItem("Eyebrows", "Select an eyebrow style", new nativeui.ItemsCollection(eyebrow_list), 0);
            var ageing_menu_item = new nativeui.UIMenuListItem("Ageing", "Select any features of old age.", new nativeui.ItemsCollection(ageing_list), 0);
            var complexion_menu_item = new nativeui.UIMenuListItem("Complexion", "Select a style of complexion.", new nativeui.ItemsCollection(complexion_list), 0);
            var sundamage_menu_item = new nativeui.UIMenuListItem("Sundamage", "Select the type of sundamage you want.", new nativeui.ItemsCollection(sundamage_list), 0);
            var moles_freckles_menu_item = new nativeui.UIMenuListItem("Moles & Freckles", "Select a style of moles or freckles.", new nativeui.ItemsCollection(moles_freckles_list), 0);

            //Male only
            var facial_hair_menu_item = new nativeui.UIMenuListItem("Facial Hair", "Select a facial hair style.", new nativeui.ItemsCollection(facial_hair_list), 0);

            //Female only
            var makeup_menu_item = new nativeui.UIMenuListItem("Makeup", "Select a style of makeup.", new nativeui.ItemsCollection(makeup_list), 0);
            var makeup_color_menu_item = new nativeui.UIMenuListItem("Makeup Color", "Select a makeup color.", new nativeui.ItemsCollection(makeup_color_list), 0);
            var blush_menu_item = new nativeui.UIMenuListItem("Blush", "Select a style of blush.", new nativeui.ItemsCollection(blush_list), 0);
            var blush_color_menu_item = new nativeui.UIMenuListItem("Blush Color", "Select a blush color.", new nativeui.ItemsCollection(blush_color_list), 0);
            var lipstick_menu_item = new nativeui.UIMenuListItem("Lipstick", "Select a lipstick style.", new nativeui.ItemsCollection(lipstick_list), 0);
            var lipstick_color_menu_item = new nativeui.UIMenuListItem("Lipstick Color", "Select a lipstick color.", new nativeui.ItemsCollection(lipstick_color_list), 0);

            var next_menu_item = new nativeui.UIMenuItem("Next", "Continue onto the next portion of character creation.");

            character_creation_menu = new nativeui.Menu("Character Creation", "Facial Features", new nativeui.Point(1450, 400));
            character_creation_menu.AddItem(hair_style_menu_item);
            character_creation_menu.AddItem(hair_color_menu_item);

            if (gender == 0) {
                character_creation_menu.AddItem(facial_hair_menu_item);
            }
            else if(gender == 1) {
                character_creation_menu.AddItem(makeup_menu_item);
                character_creation_menu.AddItem(makeup_color_menu_item);
                character_creation_menu.AddItem(blush_menu_item);
                character_creation_menu.AddItem(blush_color_menu_item);
                character_creation_menu.AddItem(lipstick_menu_item);
                character_creation_menu.AddItem(lipstick_color_menu_item);
            }

            character_creation_menu.AddItem(blemishes_menu_item);
            character_creation_menu.AddItem(eyebrow_menu_item);
            character_creation_menu.AddItem(ageing_menu_item);
            character_creation_menu.AddItem(complexion_menu_item);
            character_creation_menu.AddItem(sundamage_menu_item);
            character_creation_menu.AddItem(moles_freckles_menu_item);
            character_creation_menu.AddItem(next_menu_item);
            
            character_creation_menu.CurrentSelection = 0;
            character_creation_menu.Open();

            character_creation_menu.ListChange.on(function (list, new_index) {
                var playerHandle = mp.players.local;
                switch (list.Text) {
                    case "Hair Style":
                        hair_style = parseInt(hair_ids_list[new_index]);
                        playerHandle.setComponentVariation(2, hair_style, 0, 0);
                        break;
                    case "Hair Color":
                        hair_color = new_index;
                        playerHandle.setHairColor(hair_color, 0);
                        break;
                    case "Blemishes":
                        if (new_index == 0)
                            blemishes = 255;
                        else blemishes = new_index - 1;
                        playerHandle.setHeadOverlay(0, blemishes, 1.0, 0, 0);
                        break;
                    case "Eyebrows":
                        eyebrows = new_index;
                        playerHandle.setHeadOverlay(2, eyebrows, 1.0, hair_color, hair_color);
                        break;
                    case "Ageing":
                        if (new_index == 0)
                            ageing = 255;
                        else ageing = new_index - 1;
                        playerHandle.setHeadOverlay(3, ageing, 1.0, 0, 0);
                        break;
                    case "Complexion":
                        if (new_index == 0)
                            complexion = 255;
                        else complexion = new_index - 1;
                        playerHandle.setHeadOverlay(6, complexion, 1.0, 0, 0);
                        break;
                    case "Sundamage":
                        if (new_index == 0)
                            sun_damage = 255;
                        else sun_damage = new_index - 1;
                        playerHandle.setHeadOverlay(7, sun_damage, 1.0, 0, 0);
                        break;
                    case "Moles & Freckles":
                        if (new_index == 0)
                            moles_freckles = 255;
                        else moles_freckles = new_index - 1;
                        playerHandle.setHeadOverlay(9, moles_freckles, 1.0, 0, 0);
                        break;
                    case "Facial Hair":
                        if (new_index == 0)
                            facial_hair = 255;
                        else facial_hair = new_index - 1;
                        playerHandle.setHeadOverlay(1, facial_hair, 1.0, hair_color, hair_color);
                        break;
                    case "Makeup":
                        if (new_index == 0)
                            makeup = 255;
                        else makeup = new_index - 1;
                        playerHandle.setHeadOverlay(4, makeup, 1.0, makeup_color, makeup_color);
                        break;
                    case "Makeup Color":
                        if (new_index == 0)
                            makeup_color = 255;
                        else makeup_color = new_index - 1;
                        playerHandle.setHeadOverlay(4, makeup, 1.0, makeup_color, makeup_color);
                        break;
                    case "Blush":
                        if (new_index == 0)
                            blush = 255;
                        else blush = new_index - 1;
                        playerHandle.setHeadOverlay(5, blush, 1.0, blush_color, blush_color);
                        break;
                    case "Blush Color":
                        if (new_index == 0)
                            blush_color = 255;
                        else blush_color = new_index - 1;
                        playerHandle.setHeadOverlay(5, blush, 1.0, blush_color, blush_color);
                        break;
                    case "Lipstick":
                        if (new_index == 0)
                            lipstick = 255;
                        else lipstick = new_index - 1;
                        playerHandle.setHeadOverlay(8, lipstick, 1.0, lipstick_color, lipstick_color);
                        break;
                    case "Lipstick Color":
                        if (new_index == 0)
                            lipstick_color = 255;
                        else lipstick_color = new_index - 1;
                        playerHandle.setHeadOverlay(8, lipstick, 1.0, lipstick_color, lipstick_color);
                        break;
                }
            });

            character_creation_menu.ItemSelect.on(function (item, index) {
                if (item.Text == "Next") {
                    //Save em.
                    mp.events.callRemote("change_facial_features", hair_style, hair_color, blemishes, facial_hair, eyebrows, ageing, makeup, makeup_color, blush, blush_color, complexion, sun_damage, lipstick, lipstick_color, moles_freckles);

                    character_creation_menu.Close();
                    mp.gui.chat.push("~o~Creating menus... Please wait, this may take a second!");
                    next_character_creation_step(player, 2);
                }
            });
            break;
        }
        case 2: {
            player = mp.players.local;
            character_creation_menu.Close();

            mp.gui.chat.push("~o~Menus created!");

            mp.gui.chat.push("~g~Now you can choose what clothes you wear! You can always buy more outfits at a clothing store.");
            mp.gui.chat.push("~y~NOTE: You can use the PLUS and MINUS keys to rotate your character!");

            creation_view.setActive(true);

            pant_menu = new nativeui.Menu("Character Creation", "Pants Selection", new nativeui.Point(1450, 400));
            shoe_menu = new nativeui.Menu("Character Creation", "Shoe Selection", new nativeui.Point(1450, 400));
            accessory_menu = new nativeui.Menu("Character Creation", "Accessory Selection", new nativeui.Point(1450, 400));
            undershirt_menu = new nativeui.Menu("Character Creation", "Undershirt Selection", new nativeui.Point(1450, 400));
            top_menu = new nativeui.Menu("Character Creation", "Top Selection", new nativeui.Point(1450, 400));
            hat_menu = new nativeui.Menu("Character Creation", "Hat Selection", new nativeui.Point(1450, 400));
            glasses_menu = new nativeui.Menu("Character Creation", "Glasses Selection", new nativeui.Point(1450, 400));
            ear_menu = new nativeui.Menu("Character Creation", "Ear Accessory Selection", new nativeui.Point(1450, 400));
            torso_menu = new nativeui.Menu("Character Creation", "Torso Selection", new nativeui.Point(1450, 400));

            for (var i = 0; i < legs_list.length; i++) {
                var list = [];
                for (var j = 0; j < legs_list[i].variations.length; j++) {
                    list.push((j + 1).toString());
                }
                pant_menu.AddItem(new nativeui.UIMenuListItem(legs_list[i].name, "Press enter to select and go back.", new nativeui.ItemsCollection(list), 0));
            }

            for (var i = 0; i < shoes_list.length; i++) {
                var list = [];
                for (var j = 0; j < shoes_list[i].variations.length; j++) {
                    list.push((j + 1).toString());
                }
                shoe_menu.AddItem(new nativeui.UIMenuListItem(shoes_list[i].name, "Press enter to select and go back.", new nativeui.ItemsCollection(list), 0));
            }

            for (var i = 0; i < access_list.length; i++) {
                var list = [];
                for (var j = 0; j < access_list[i].variations.length; j++) {
                    list.push((j + 1).toString());
                }
                accessory_menu.AddItem(new nativeui.UIMenuListItem(access_list[i].name, "Press enter to select and go back.", new nativeui.ItemsCollection(list), 0));
            }

            for (var i = 0; i < undershits_list.length; i++) {
                var list = [];
                for (var j = 0; j < undershits_list[i].variations.length; j++) {
                    list.push((j + 1).toString());
                }
                undershirt_menu.AddItem(new nativeui.UIMenuListItem(undershits_list[i].name, "Press enter to select and go back.", new nativeui.ItemsCollection(list), 0));
            }

            for (var i = 0; i < tops_list.length; i++) {
                var list = [];
                for (var j = 0; j < tops_list[i].variations.length; j++) {
                    list.push((j + 1).toString());
                }
                top_menu.AddItem(new nativeui.UIMenuListItem(tops_list[i].name, "Press enter to select and go back.", new nativeui.ItemsCollection(list), 0));
            }

            for (var i = 0; i < hats_list.length; i++) {
                var list = [];
                for (var j = 0; j < hats_list[i].variations.length; j++) {
                    list.push((j + 1).toString());
                }
                hat_menu.AddItem(new nativeui.UIMenuListItem(hats_list[i].name, "Press enter to select and go back.", new nativeui.ItemsCollection(list), 0));
            }

            for (var i = 0; i < glasses_list.length; i++) {
                var list = [];
                for (var j = 0; j < glasses_list[i].variations.length; j++) {
                    list.push((j + 1).toString());
                }
                glasses_menu.AddItem(new nativeui.UIMenuListItem(glasses_list[i].name, "Press enter to select and go back.", new nativeui.ItemsCollection(list), 0));
            }

            for (var i = 0; i < ears_list.length; i++) {
                var list = [];
                for (var j = 0; j < ears_list[i].variations.length; j++) {
                    list.push((j + 1).toString());
                }
                ear_menu.AddItem(new nativeui.UIMenuListItem(ears_list[i].name, "Press enter to select and go back.", new nativeui.ItemsCollection(list), 0));
            }
            
	        var variations = mp.game.invoke("0x27561561732A7842", 0, player.handle, 3);
	        for (var i = 0; i < variations; i++) {
		        var list = [];
		        var types = mp.game.invoke("0x8F7156A3142A6BAD", 0, player.handle, 3, i);
		        for (var j = 0; j < types; j++) {
			        list.push((j + 1).toString());
		        }
		        torso_menu.AddItem(new nativeui.UIMenuListItem("Style " + i, "Press enter to select and go back.", new nativeui.ItemsCollection(list), 0));
	        }

            var pants_index = 0;
            var pants_variation = 0;
            var shoe_index = 0;
            var shoe_variation = 0;
            var accessory_index = 0;
            var accessory_variation = 0;
            var undershirt_index = 0;
            var undershirt_variation = 0;
            var top_index = 0;
            var top_variation = 0;
            var hat_index = 0;
            var hat_variation = 0;
            var glasses_index = 0;
            var glasses_variation = 0;
            var ear_index = 0;
            var ear_variation = 0;

			var torso_index = 0;
			var torso_variation = 0;

            character_creation_menu = new nativeui.Menu("Character Creation", "Outfit Selection", new nativeui.Point(1450, 400));
            character_creation_menu.AddItem(new nativeui.UIMenuItem("Pants", "View the available pants"));
            character_creation_menu.AddItem(new nativeui.UIMenuItem("Shoes", "View the available shoes"));
            character_creation_menu.AddItem(new nativeui.UIMenuItem("Accessories", "View the available accesories. These may require not having an undershirt or top to see."));
            character_creation_menu.AddItem(new nativeui.UIMenuItem("Tops", "View the available tops. Some of these require an undershirt."));
            character_creation_menu.AddItem(new nativeui.UIMenuItem("Undershirts", "View the available undershirts. These may require a certain top to look correct."));
            character_creation_menu.AddItem(new nativeui.UIMenuItem("Hats", "View the available hats"));
            character_creation_menu.AddItem(new nativeui.UIMenuItem("Glasses", "View the available glasses"));
            character_creation_menu.AddItem(new nativeui.UIMenuItem("Ear Accessories", "View the available ear accessories"));
	        character_creation_menu.AddItem(new nativeui.UIMenuItem("Torsos", "View the available torsos."));
            character_creation_menu.AddItem(new nativeui.UIMenuItem("Next", "Continue to the final step of character creation."));
            
            character_creation_menu.Open();

            pant_menu.IndexChange.on(function (index, itm) {
                pants_index = index;
                pants_variation = 0;
                updateClothes(4, pants_index, pants_variation);
            });

            pant_menu.ListChange.on(function (list, index) {
                pants_variation = index;
                updateClothes(4, pants_index, pants_variation);
            });

	        pant_menu.MenuClose.on((forced) => {
		        character_creation_menu.Open();
            });
            
            pant_menu.ItemSelect.on(() => {
                pant_menu.Close();
                character_creation_menu.Open();
            });

            shoe_menu.IndexChange.on(function (index, itm) {
                shoe_index = index;
                shoe_variation = 0;
                updateClothes(6, shoe_index, shoe_variation);
            });

            shoe_menu.ListChange.on(function (list, index) {
                shoe_variation = index;
                updateClothes(6, shoe_index, shoe_variation);
            });

	        shoe_menu.MenuClose.on((forced) => {
		        character_creation_menu.Open();
	        });

            accessory_menu.IndexChange.on(function (index, itm) {
                accessory_index = index;
                accessory_variation = 0;
                updateClothes(7, accessory_index, accessory_variation);
            });

            accessory_menu.ListChange.on(function (list, index) {
                accessory_variation = index;
                updateClothes(7, accessory_index, accessory_variation);
            });

	        accessory_menu.MenuClose.on((forced) => {
		        character_creation_menu.Open();
	        });

            undershirt_menu.IndexChange.on(function (index, itm) {
                undershirt_index = index;
                undershirt_variation = 0;
                updateClothes(8, undershirt_index, undershirt_variation);
            });

            undershirt_menu.ListChange.on(function (list, index) {
                undershirt_variation = index;
                updateClothes(8, undershirt_index, undershirt_variation);
            });

	        undershirt_menu.MenuClose.on((forced) => {
		        character_creation_menu.Open();
	        });

            top_menu.IndexChange.on(function (index, itm) {
                top_index = index;
                top_variation = 0;
                updateClothes(11, top_index, top_variation);
            });

            top_menu.ListChange.on(function (list, index) {
                top_variation = index;
                updateClothes(11, top_index, top_variation);
            });

	        top_menu.MenuClose.on((forced) => {
		        character_creation_menu.Open();
	        });

            hat_menu.IndexChange.on(function (index, itm) {
                hat_index = index;
                hat_variation = 0;
                updateClothes(20, hat_index, hat_variation);
            });

            hat_menu.ListChange.on(function (list, index) {
                hat_variation = index;
                updateClothes(20, hat_index, hat_variation);
            });

	        hat_menu.MenuClose.on((forced) => {
		        character_creation_menu.Open();
	        });

            glasses_menu.IndexChange.on(function (index, itm) {
                glasses_index = index;
                glasses_variation = 0;
                updateClothes(21, glasses_index, glasses_variation);
            });

            glasses_menu.ListChange.on(function (list, index) {
                glasses_variation = index;
                updateClothes(21, glasses_index, glasses_variation);
            });

	        glasses_menu.MenuClose.on((forced) => {
		        character_creation_menu.Open();
	        });

            ear_menu.IndexChange.on(function (index, itm) {
                ear_index = index;
                ear_variation = 0;
                updateClothes(22, ear_index, ear_variation);
            });

            ear_menu.ListChange.on(function (list, index) {
                ear_variation = index;
                updateClothes(22, ear_index, ear_variation);
            });

	        ear_menu.MenuClose.on((forced) => {
		        character_creation_menu.Open();
	        });

	        torso_menu.IndexChange.on(function (index, itm) {
		        torso_index = index;
		        torso_variation = 0;
		        updateClothes(3, torso_index, torso_variation);
	        });

	        torso_menu.ListChange.on(function (list, index) {
		        torso_variation = index;
		        updateClothes(3, torso_index, torso_variation);
	        });

	        torso_menu.MenuClose.on((forced) => {
		        character_creation_menu.Open();
	        });

            character_creation_menu.ItemSelect.on(function (item, index) {
                character_creation_menu.Close();
                switch (item.Text) {
                    case "Pants":
                        creation_view.setActive(true);
                        pant_menu.Open();
                        pant_menu.CurrentSelection = 0;
                        break;
                    case "Shoes":
                        creation_view.setActive(true);
                        shoe_menu.Open();
                        shoe_menu.CurrentSelection = 0;
                        break;
                    case "Accessories":
                        creation_view.setActive(true);
                        accessory_menu.Open();
                        accessory_menu.CurrentSelection = 0;
                        break;
                    case "Undershirts":
                        creation_view.setActive(true);
                        undershirt_menu.Open();
                        undershirt_menu.CurrentSelection = 0;
                        break;
                    case "Tops":
                        creation_view.setActive(true);
                        top_menu.Open();
                        top_menu.CurrentSelection = 0;
                        break;
                    case "Hats":
                        facial_view.setActive(true);
                        facial_view.pointAtPedBone(player.handle, 65068, 0, 0, 0, true);
                        hat_menu.Open();
                        hat_menu.CurrentSelection = 0;
                        break;
                    case "Glasses":
                        facial_view.setActive(true);
                        facial_view.pointAtPedBone(player.handle, 65068, 0, 0, 0, true);
                        glasses_menu.Open();
                        glasses_menu.CurrentSelection = 0;
                        break;
                    case "Ear Accessories":
                        facial_view.setActive(true);
                        facial_view.pointAtPedBone(player.handle, 65068, 0, 0, 0, true);
                        ear_menu.Open();
                        ear_menu.CurrentSelection = 0;
                        break;
					case "Torsos":
						creation_view.setActive(true);
						torso_menu.Open();
						torso_menu.CurrentSelection = 0;
						break;
                    case "Next":
                        //Save clothes.
                        mp.events.callRemote("change_clothes", pants_index, pants_variation, shoe_index, shoe_variation, accessory_index, accessory_variation, undershirt_index, undershirt_variation, top_index, top_variation, hat_index, hat_variation, glasses_index, glasses_variation, ear_index, ear_variation, torso_index, top_variation);
                        character_creation_menu.Close();
                        next_character_creation_step(player, 3);
                        break;
                }
            });
            break;
        }
        case 3: {
            player = mp.players.local;
            character_creation_menu.Close();

            mp.gui.chat.push("~y~Lastly, we need some basic information about your character!");

            var age_list = [];

            for(var i = 18; i <= 80; i++){
                age_list.Add((i).toString());
            }

            var spawn_list = [];
            //spawn_list.Add("Los Santos Airport");
            spawn_list.push("Dashound Bus Station");

            var age_menu = new nativeui.UIMenuListItem("Age", "Select a reasonable age for your character. This should match their appreance.", new nativeui.ItemsCollection(age_list), 0);
            var birthday_menu = new nativeui.UIMenuItem("Birthday", "Input a birthday for your character. This should follow the format: DD/MM");
            var birthplace_menu = new nativeui.UIMenuItem("Birthplace", "Input your characters birthplace. This should follow the format: City, Country");
            var spawn_menu = new nativeui.UIMenuListItem("Spawn Location", "Select where you would like to start your journey.", new nativeui.ItemsCollection(spawn_list), 0);

            character_creation_menu = new nativeui.Menu("Character Creation", "Basic Character Information", new mp.Vector3(0, 0, 6));

            character_creation_menu.AddItem(age_menu);
            character_creation_menu.AddItem(birthday_menu);
            character_creation_menu.AddItem(birthplace_menu);
            character_creation_menu.AddItem(spawn_menu);
            character_creation_menu.AddItem(new nativeui.UIMenuItem("Finish Character Creation", "Finish character creation and spawn. This cannot be undone."));
            
            character_creation_menu.Open();

            var spawn_point = 0;
            var age = 18;
            var birthday = "01/01";
            var birthplace = "Los Santos, USA";

            birthday_menu.SetRightLabel(birthday);
            birthplace_menu.SetRightLabel(birthplace);

            character_creation_menu.ItemSelect.on(async function (item, index) {
                switch(item.Text){
                    case "Birthday":
                        birthday = await getUserInputAsync({title: "DD/MM", maxLength: 5, showMaxLength: true});

                        var patt = new RegExp("([0-9]+)\/([0-9]+)");
                        var res = patt.exec(birthday);
                        if (res == null) {
                            birthday = "01/01";
                            mp.gui.chat.push("Wrong age format.");
                        } else {
                            if (parseInt(res[1]) > 31 || parseInt(res[2]) > 12) {
                                birthday = "01/01";
                                mp.gui.chat.push("Days must be less than 31 and month must be less than 12.");
                            }
                        }

                        birthday_menu.SetRightLabel(birthday);
                        break;
                    case "Birthplace":
                        birthplace = await getUserInputAsync({title: "Los Santos, USA", maxLength: 32, showMaxLength: true});
                        birthplace_menu.SetRightLabel(birthplace);
                        break;
                    case "Finish Character Creation":
                        character_creation_menu.Close();
                        mp.events.callRemote("finish_character_creation", age, birthday, birthplace, spawn_point);
                
                        mp.game.cam.renderScriptCams(false, false, 0, false, false);
                        character_creation_menu = null;
                        break;
                }
            });

            character_creation_menu.ListChange.on((itm, new_index) => {
                if(itm == age_menu) {
                    age = new_index + 19;
                } else if(itm == spawn_menu) {
                    spawn_point = new_index;
                }
            });
        }
    }
}

function updateClothes(type, index, variation) {
    if (type === 4) {
        mp.players.local.setComponentVariation(type, parseInt(legs_list[index].id), parseInt(legs_list[index].variations[variation]) - 1, 0);
    }
    else if (type === 6) {
        mp.players.local.setComponentVariation(type, parseInt(shoes_list[index].id), parseInt(shoes_list[index].variations[variation]) - 1, 0);
    }
    else if (type === 7) {
        mp.players.local.setComponentVariation(type, parseInt(access_list[index].id), parseInt(access_list[index].variations[variation]) - 1, 0);
    }
    else if (type === 8) {
        mp.players.local.setComponentVariation(type, parseInt(undershits_list[index].id), parseInt(undershits_list[index].variations[variation]) - 1, 0);
    }
    else if (type === 11) {
        mp.players.local.setComponentVariation(type, parseInt(tops_list[index].id), parseInt(tops_list[index].variations[variation]) - 1, 0);
    }
    else if (type === 20) {
        mp.players.local.setPropIndex(0, parseInt(hats_list[index].id), parseInt(hats_list[index].variations[variation]) - 1, true);
    }
    else if (type === 21) {
        mp.players.local.setPropIndex(1, parseInt(glasses_list[index].id), parseInt(glasses_list[index].variations[variation]) - 1, true);
    }
    else if (type === 22) {
        mp.players.local.setPropIndex(2, parseInt(ears_list[index].id), parseInt(ears_list[index].variations[variation]) - 1, true);
    }
    else if (type === 3) {
        mp.players.local.setComponentVariation(type, index, variation, 0);
    }
}

var rotating = 0;
mp.keys.bind(0xBB, true, function() {
    rotating = 4;
});
mp.keys.bind(0xBD, true, function() {
    rotating = -4;
});
mp.keys.bind(0xBB, false, function() {
    rotating = 0;
});
mp.keys.bind(0xBD, false, function() {
    rotating = 0;
});

mp.events.add('render', () => {
    if (rotating != 0 && character_creation_menu !== null) {
        let rots = mp.players.local.getRotation(2);
        mp.players.local.setRotation(rots.x, rots.y, rots.z+rotating, 2, true);
    }
});
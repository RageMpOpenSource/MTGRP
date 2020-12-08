const Natives = {
    SET_PED_WEAPON_TINT_INDEX: "0x50969B9B89ED5738",
    SET_CURRENT_PED_WEAPON: "0xADF692B254977C0C"
};

mp.events.add("entityStreamIn", (entity) => {
    if (entity.type === "player") {
        let data = entity.getVariable("currentWeaponTint");

        if (data) {
            let [weaponHash, tintIndex] = data.split("|");
            weaponHash = parseInt(weaponHash, 36);

            entity.giveWeapon(weaponHash, -1, true);
            mp.game.invoke(Natives.SET_PED_WEAPON_TINT_INDEX, entity.handle, weaponHash >> 0, tintIndex >> 0);
            mp.game.invoke(Natives.SET_CURRENT_PED_WEAPON, entity.handle, weaponHash >> 0, tintIndex >> 0);
        }
    }
});

mp.events.addDataHandler("currentWeaponTint", (entity, value) => {
    if (entity.type === "player" && entity.handle !== 0) {
        let [weaponHash, tintIndex] = value.split("|");
        weaponHash = parseInt(weaponHash, 36);

        mp.game.invoke(Natives.SET_PED_WEAPON_TINT_INDEX, entity.handle, weaponHash >> 0, tintIndex >> 0);
    }
});
function getUserInputAsync(options) {
    const {
        title = "", // Title shown on the input box
        defaultText = "", // Default value of the input box
        maxLength = 32, // Obvious enough, maximum length of the input
        showMaxLength = false, // If true, will display max length on title
        trimResult = true, // Removes whitespace from the player's input
        rejectIfEmpty = true, // If true, empty input causes promise rejection instead of resolving with an empty string
        timeout = 0 // If higher than 0, input box will close & promise will be rejected with the reason "timeout" if the player fails to write something in specified milliseconds.
    } = options || {};

    // DISPLAY_ONSCREEN_KEYBOARD only accepts GXT entries as title
    mp.game.gxt.set("TEMP_ASYNC_INPUT_TITLE", showMaxLength ? `${title} (Max ${maxLength} characters)` : title);

    return new Promise((resolve, reject) => {
        mp.game.gameplay.displayOnscreenKeyboard(6, "TEMP_ASYNC_INPUT_TITLE", "", defaultText, "", "", "", maxLength);

        const endTime = Date.now() + timeout;
        const timer = setInterval(() => {
            if (timeout > 0 && Date.now() > endTime) {
                mp.game.invoke("0x8817605C2BA76200"); // _FORCE_CLOSE_TEXT_INPUT_BOX

                clearInterval(timer);
                reject("timeout");
            }

            switch (mp.game.gameplay.updateOnscreenKeyboard()) {
                case 1:
                    clearInterval(timer);

                    let result = mp.game.gameplay.getOnscreenKeyboardResult();
                    if (trimResult && result) {
                        result = result.trim();
                    }

                    if (rejectIfEmpty && (!result || result.length === 0)) {
                        reject("empty");
                    } else {
                        resolve(result);
                    }

                    break;

                case 2:
                    clearInterval(timer);
                    reject("cancelled");
                    break;

                case 3:
                    clearInterval(timer);
                    reject("keyboard_not_active");
                    break;
            }
        }, 100);
    });
}
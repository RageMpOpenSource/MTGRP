let login_view = mp.cameras.new('default', new mp.Vector3(682.7154, 1063.229, 353.9427), new mp.Vector3(-3.673188, -10.46521, -18.79283), 40);
login_view.pointAtCoord(718.9848, 1194.599, 325.2131);

var login_browser = null;

Event.OnResourceStart.connect(function () {
    login_browser = mp.browsers.new("package://player_manager/login/Login.html");
    mp.gui.cursor.show(true, true);
    mp.gui.chat.activate(false);
});

mp.events.add('onPlayerConnectedEx', (isReg) => {
    login_view.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 2000, true, false);
    login_browser.execute(`update_box_info('${mp.players.local.name}', ${isReg});`);
});

mp.events.add('login_finished', () => {
    login_view.setActive(false);
    mp.game.cam.renderScriptCams(false, false, 2000, true, false);
    mp.gui.chat.activate(true);
});

mp.events.add('login_error', (err) => {
    login_browser.execute(`login_error('${err}');`);
});

mp.events.add('hide_login_browser', () => {
    if (login_browser != null) {
        mp.gui.cursor.show(false, false);
        login_browser.destroy();
        mp.gui.chat.activate(true);
        login_browser = null;
    }
});

mp.events.add('admin_pin_check', () => {
    var adminPin = API.getUserInput("", 5); // TODO: Use alternative
    mp.events.callRemote("admin_pin_check", adminPin);
});
mp.events.add('create_admin_pin', () => {
    var adminPinCreate = API.getUserInput("", 5); // TODO: Use alternative
    mp.events.callRemote("create_admin_pin", adminPinCreate);
});


//CEF event
mp.events.add('attempt_login', (password) => {
    mp.events.callRemote("attempt_login", password);
});

/*
MANUAL LOGIN DISABLED

Event.OnKeyDown.connect((sender, e) =>
{
	if (e.KeyCode === Keys.F12 && login_browser !== null) {
		API.showCursor(false);
		API.setCanOpenChat(true);
		API.destroyCefBrowser(login_browser);
		login_browser = null;
	}
});
*/
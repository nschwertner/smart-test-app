import Config from './config.js';

let TST = {
}

TST.displayScreen = (screenID) => {
    let screens = ['result-screen','error-screen'];
    for (let s of screens) {
        $('#'+s).hide();
    }
    $('#'+screenID).show();
}

TST.displayLaunchScreen = () => {
    TST.displayScreen('launch-screen');
}

TST.displayQueryScreen = () => {
    TST.displayScreen('query-screen');
}

TST.displayResultScreen = (message) => {
    $('#result-message').html("<pre>" + message + "</pre>");
    TST.displayScreen('result-screen');
}

TST.displayErrorScreen = (message) => {
    $('#error-message').html("<pre>" + message + "</pre>");
    TST.displayScreen('error-screen');
}

TST.disable = (id) => {
    $("#"+id).prop("disabled",true);
}

TST.enable = (id) => {
    $("#"+id).prop("disabled",false);
}

TST.query = async () => {
    TST.disable("btn-execute");
    const query = $('#query-text').val();
    try {
        const result = await TST.client.request(query);
        TST.displayResultScreen(JSON.stringify(result,null,"   ").replace("<","&lt;").replace('>', '&gt;'));
        TST.enable("btn-execute");
    } catch (e) {
        TST.displayErrorScreen (e.message.replace("<","&lt;").replace('>', '&gt;'));
        TST.enable("btn-execute");
    }
}

TST.initialize = (client) => {
    TST.client = client;
    TST.displayQueryScreen();
}

TST.initLaunch = () => {
    $('#config-text').val(JSON.stringify(Config.settings,null,"   "));
    $('#btn-launch').click(() => {
        TST.disable("btn-launch");
        const configtext = $('#config-text').val();
        const conf = JSON.parse(configtext);
        FHIR.oauth2.authorize(conf);
    });
    TST.displayLaunchScreen();
}

TST.initApp = () => {
    $('#query-text').val(Config.query);
    $('#btn-execute').click(TST.query);

    FHIR.oauth2.ready(TST.initialize, (error) => {
        TST.displayErrorScreen(error.message.replace("<","&lt;").replace('>', '&gt;'))
    });
}

export default TST;
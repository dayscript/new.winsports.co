var opta_settings = {
    subscription_id: '0d563315bc5baa76d5f7f6ea5da66bfb',
    language: 'es_CO',
    timezone: 'America/Bogota',
    load_when_visible: false,
    link_callback: function (params) {
        var h = '';
        //h += '//test.winsports.co/';
        h += '//nuevo.winsports.co/';
        if (params.match) {
            h += 'matches/' + params.match;
        }
        return h;
    }
};
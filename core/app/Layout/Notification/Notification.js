CasinoDirectives
    .factory ('Notification', ['SYSTEM', 'notify', '$filter', function (SYSTEM, notify, $filter) {

        var config = {
            duration: 5000,
            position: 'right'
        };

        if (SYSTEM.notification && SYSTEM.notification.config) {
            Object.keys(SYSTEM.notification.config).forEach(function (key){
                config[key] = SYSTEM.notification.config[key];
            });
        }
        notify.config(config);

        var show = function(key, config) {
                config = config || {};
                config.message = $filter('translate')(key);
                notify(config);
            };

    return {
        show: show
    }

}]);
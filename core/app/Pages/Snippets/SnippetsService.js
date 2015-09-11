CasinoServices
    .factory('Snippets', ['Pages', '$rootScope', function (Pages, $rootScope) {
        var snippets = [],
            callbacks = [],
            inited = false;
        return {
            init: function () {
                var load =function () {
                    Pages.snippets({l: $rootScope.currentLocale}, function(data){
                        snippets = data;
                        for (var key in callbacks) {
                            callbacks[key]();
                        }
                        inited = true;
                    });
                }

                $rootScope.$watch('currentLocale', function (newValue, oldValue) {
                    if ($rootScope.currentLocale && newValue != oldValue) {
                        load();
                    }
                });

                if ($rootScope.currentLocale) {
                    load();
                }

            },
            add: function(callback) {
                if (!inited) {
                    callbacks.push(callback);
                } else {
                    callback();
                }
            },
            getByName: function (name) {
                var res = {};
                for (var key in snippets) {
                    if (snippets[key].id == name) {
                        res = snippets[key];
                        break;
                    }
                }
                return res;
            }
        }
    }]);

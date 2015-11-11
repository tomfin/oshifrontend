'use strict';

CasinoServices
    .factory('apiHeaders', ['$q', 'SYSTEM', '$rootScope', function ($q, SYSTEM, $rootScope) {
        return {
            'request': function (config) {
                config.headers.Accept = SYSTEM.API_REQUEST_ACCEPT;
                //if ($rootScope.Info.service) {
                //    config.headers['X-CSRF-Token'] = $rootScope.Info.service.csrf;
                //}
                if ($rootScope.currentLocale) {
                    config.headers['Accept-Language'] = $rootScope.currentLocale;
                }
                config.headers['Content-Type'] = 'application/json;charset=UTF-8';
                return config;
            },
            'response': function(response) {
                if (response.config.url.indexOf('api/users') != -1) {
                    var location = response.headers('Location');
                    if (location && location != '/') {
                        window.location.href = window.location.origin + location;
                    }
                }
                //TODO check X-SoftSwiss-Media-Type
                return response;
            }
        };
    }])

    .factory('siteLanguage', ['$q', '$rootScope', '$stateParams', '$location', 'Info', 'Player', '$state', function ($q, $rootScope, $stateParams, $location, Info, Player, $state) {
        return {
            init: function () {
                var params = {};
                $rootScope.Info = {};

                if ($location.search().ctag && typeof($location.search().ctag) == "string") {
                    params.ctag = $location.search().ctag;
                    $location.search('ctag', null);
                }
                if ($location.search().btag && typeof($location.search().btag) == "string") {
                    params.btag = $location.search().btag;
                    $location.search('btag', null);
                }
                if ($location.search().refer && typeof($location.search().refer) == "string") {
                    params.refer = $location.search().refer;
                    $location.search('refer', null);
                }

                $q.all({
                    languages: Info.locales(params).$promise,
                    user: Player.get().$promise
                }).then(function (result) {
                    $rootScope.Info["locales"] = result.languages;

                    var default_language = $rootScope.Info.locales.filter(function (item) {
                        return item.default;
                    });

                    $rootScope.default_language = default_language[0].code;
                    if (!$rootScope.currentLocale) {
                        $rootScope.currentLocale = default_language[0].code;
                    }

                    var user_data = result.user.toJSON();
                    $rootScope.user_language = user_data.language;
                });
            },

            run: function () {
                var defer = $q.defer();
                $rootScope.$watch('default_language', function (new_value, old_value) {
                    if (new_value != old_value) {
                        defer.resolve(true);
                    }
                });
                return defer.promise;
            },

            check: function () {
                var reload = false,
                    lang = $stateParams.lang.replace('/', '');

                if (lang == '') {
                    lang = $rootScope.default_language;
                }

                if ($rootScope.user_language && $rootScope.user_language != lang) {
                    lang = $rootScope.user_language;
                }

                if ($rootScope.currentLocale != lang) {
                    $rootScope.currentLocale = lang;
                    reload = true;
                }

                if (lang == $rootScope.default_language) {
                    lang = '';
                }

                if (lang != $stateParams.lang.replace('/', '')) {
                    $state.go($state.current, {lang: lang}, {reload: reload});
                }
            }
        };
    }])

    .factory('Init', ['$rootScope', '$location', 'Batch', 'Pages', 'SYSTEM', 'Info', 'Auth', 'Player', '$q', function ($rootScope, $location, Batch, Pages, SYSTEM, Info, Auth, Player, $q) {
        return {
            currency: function () {
                if (!Auth.authorize(Auth.accessLevels.anon)) {
                    if (!$rootScope.currentCurrency) {
                        $rootScope.currentCurrency = $rootScope.Info.currencies[0].code;
                    }
                } else {
                    $rootScope.currentCurrency = false;
                }
            },

            data: function (callback) {
                callback = callback || function () {
                };

                var urls = [
                    SYSTEM.URL_API + "/info/currencies",
                    SYSTEM.URL_API + "/info/time_zones",
                    SYSTEM.URL_API + "/info/countries"
                ];
                $rootScope.Info = $rootScope.Info || {};

                $q.all({
                    auth: Auth.check(),
                    batch: Batch.get({'url[]': urls}).$promise
                }).then(function (result) {

                    urls.forEach(function (item, i) {
                        var url = item.split("/"),
                            category = url.pop(),
                            type = url.pop();

                        if (type == "games" && category == "order") {

                            category = type + "_" + category;
                        }

                        $rootScope.Info[category] = JSON.parse(result.batch[i]);

                    });
                    callback();

                })
                ;
            },

            files: function (callback) {
                callback = callback || function () {
                };

                Pages.files({l: $rootScope.currentLocale}, function (data) {
                    $rootScope.Info['files'] = data;
                    callback();
                });
            }
        };
    }])

    .factory('Info', ['$resource', 'SYSTEM', function ($resource, SYSTEM) {
        return $resource(SYSTEM.URL_API + '/info/:action', {}, {
            locales: {method: 'GET', params: {action: 'locales'}, cache: true, isArray: true},
            currencies: {method: 'GET', params: {action: 'currencies'}, cache: true, isArray: true},
            profile_fields: {method: 'GET', params: {action: 'profile_fields'}, cache: true, isArray: true},
            profile_routes: {method: 'GET', params: {action: 'profile_routes'}, cache: true}
        });
    }])

    .factory('Pages', ['$resource', 'SYSTEM', function ($resource, SYSTEM) {
        return $resource(SYSTEM.URL_API + '/cms/:action/:id', {}, {
            list: {method: 'GET', params: {action: 'pages'}, cache: true, isArray: true},
            byId: {method: 'GET', params: {action: 'pages'}, cache: true},
            files: {method: 'GET', params: {action: 'files'}, cache: false, isArray: true},
            snippets: {method: 'GET', params: {action: 'snippets'}, cache: true, isArray: true}
        });
    }])

    .factory('Batch', ['$resource', 'SYSTEM', function ($resource, SYSTEM) {
        return $resource(SYSTEM.URL_BATCH, {}, {
            get: {method: 'get', params: {}, cache: false, isArray: true}
        });
    }])

    .factory('User', ['$resource', 'SYSTEM', function ($resource, SYSTEM) {
        return $resource(SYSTEM.URL_API + '/users/:action', {}, {
            sign_in: {method: 'post', params: {action: 'sign_in'}},
            sign_up: {method: 'post', params: {action: ''}},
            forgot_password: {method: 'post', params: {action: 'password'}},
            reset_password: {method: 'put', params: {action: 'password'}},
            sign_out: {method: 'delete', params: {action: 'sign_out'}},
            sent_email_confirmation: {method: 'post', params: {action: 'confirmation'}},
            email_confirmation: {method: 'get', params: {action: 'confirmation'}},
            sent_unlock_email: {method: 'post', params: {action: 'unlock'}},
            unlock_email: {method: 'get', params: {action: 'unlock'}}
        });
    }])
    .factory('Player', ['$resource', 'SYSTEM', function ($resource, SYSTEM) {
        return $resource(SYSTEM.URL_API + '/player/:action', {}, {
            get: {method: 'get', params: {action: ''}},
            balance: {method: 'get', params: {action: 'accounts'}, isArray: true},
            stats: {method: 'get', params: {action: 'stats'}, isArray: false}
        });
    }])
    .factory('Jackpots', ['$resource', 'SYSTEM', function ($resource, SYSTEM) {
        return $resource(SYSTEM.URL_API + '/games/jackpots', {}, {
            list: {method: 'GET', isArray: false, cache: true}
        });
    }])
    .factory('Geoip', ['$http', '$resource', function ($http, $resource) {

        //return $resource('http://www.telize.com/geoip', {}, {
        //    data: {method: 'GET', isArray: false, cache: true}
        //});
        return {
            data: function (callback) {
                callback = callback || function () {
                };
                $.ajax({
                    dataType: "json",
                    url: "https://telize.com/geoip",
                    success: callback,
                    cache: true
                })

            }
        }
    }])
;

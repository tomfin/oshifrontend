'use strict';

CasinoServices
    .factory('apiHeaders', ['$q' , 'SYSTEM', '$rootScope', function ($q, SYSTEM, $rootScope) {
        return {
            'request': function (config){
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

    .factory('Init', ['$rootScope', '$location', 'Batch', 'Pages', 'SYSTEM', 'Info', 'Auth', 'localStorageService', '$q', function ($rootScope, $location, Batch, Pages, SYSTEM, Info, Auth, localStorageService, $q) {
        return {
            local: function (callback) {
                callback = callback || function() {};

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

                Info.locales(params, function (data) {

                    $rootScope.Info["locales"] = data;

                    var currentLocale = $rootScope.Info.locales.filter(function (item){
                       return item.default;
                    });

                    if (!localStorageService.get("currentLocale")) {
						localStorageService.set("currentLocale", currentLocale[0].code);
                    }

                    $rootScope.currentLocale = localStorageService.get("currentLocale");

                    callback();
                });
            },

            data: function (callback) {
                callback = callback || function() {};

                var urls = [
                        SYSTEM.URL_API + "/info/currencies",
                        //SYSTEM.URL_API + "/cms/files",
                        SYSTEM.URL_API + "/info/time_zones",
                        SYSTEM.URL_API + "/info/countries",
                        //SYSTEM.URL_API + "/info/profile_routes",
                        SYSTEM.URL_API + "/games/order"
                ];
                $rootScope.Info = $rootScope.Info || {};

                $q.all({
                    auth: Auth.check(),
                    batch: Batch.get({'url[]':urls}).$promise
                }).then(function (result){
                    urls.forEach(function(item, i) {
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
                callback = callback || function () {};

                Pages.files({l: $rootScope.currentLocale}, function(data){
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
            get: {method: 'get', params: {}, cache: true, isArray: true}
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

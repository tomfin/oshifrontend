CasinoServices
    .factory('Games', ['$resource', 'SYSTEM', '$rootScope', function ($resource, SYSTEM, $rootScope) {
        return $resource(SYSTEM.URL_API + '/games/:action', {}, {
            list: {method: 'get', params: {action: ''}, cache: true, isArray: true},
            demo: {method: 'get', params: {action: 'demo'}, cache: true, isArray: true},
            collections: {method: 'get', params: {action: 'collections'}, cache: true, isArray: true},
            providers: {method: 'get', params: {action: 'providers'}, cache: true, isArray: true},
            order: {method: 'get', params: {action: 'order'}, cache: true, isArray: false}
        });
    }])
    .factory('GamesList', ['Games', 'Auth', 'GamesCdn', '$rootScope', '$q', 'Jackpots', 'Info', '$window', '$timeout', function (Games, Auth, GamesCdn, $rootScope, $q, Jackpots, Info, $window, $timeout) {
        var gameByIdentifier = function (gameArray, game_data) {
            var game;
            for (var i=0; i < gameArray.length; i++) {

                if (gameArray[i].identifier == game_data.identifier &&
                    gameArray[i].devices.join("-") ==  game_data.devices.join("-")) {

                    game = gameArray[i];
                    break;
                }
            }
            return game;
        };

        return {
            getGameList: function (show_all) {
                var defer = $q.defer();
                var user = Auth.user,
                    actions = {};

                actions.demo = Games.demo({l: $rootScope.currentLocale}).$promise;
                //TODO add me to batch
                actions.order = Games.order().$promise;
                if (Auth.authorize(Auth.accessLevels.user, user.role) || show_all) {
                    actions.list = Games.list({l: $rootScope.currentLocale}).$promise;
                    actions.jackpots = Jackpots.list().$promise;
                    actions.currencies = Info.currencies().$promise;
                }

                $q.all(actions)
                    .then(function (result){
                        var data = result['list'] || result['demo'],
                            data_demo = result['demo'];

                        if (show_all) {
                            data = [].concat(data, data_demo);
                        }

                        GamesCdn.iconURIforEach(data);

                        for (var key in data) {
                            //if ($rootScope.Info.games_order) {
                            //    data[key].order = $rootScope.Info.games_order[data[key].identifier];
                            //}
                            if (result['order']) {
                                data[key].order = result['order'][data[key].identifier];
                            }

                            if (result.jackpots && result.jackpots[data[key].currency] && result.jackpots[data[key].currency][data[key].identifier]) {
                                var currency = result.currencies.filter(function (value) {
                                    return value.code == data[key].currency;
                                });
                                data[key].jackpot = result.jackpots[data[key].currency][data[key].identifier] / currency[0].subunits_to_unit;;
                                data[key].currency_symbol = currency[0].symbol;
                            }

                            var demo_game = gameByIdentifier(data_demo, data[key]);

                            if (demo_game) {
                                data[key].play_url_fun = demo_game.play_url;
                                data[key].demo_id = demo_game.id;
                            }
                        }
                        defer.resolve(data);
                    });

                return defer.promise;
            },

            make: function ($scope) {
                var that = this;

                $scope.user = Auth.user;

                var defer = $q.defer();

                var applyGameList = function (data){
                    $scope.games = data;
                    return data.$promise;
                };

                $scope.$watch('user', function (newValue, oldValue) {
                    if ($scope.user && newValue != oldValue) {
                        that.getGameList()
                            .then(applyGameList)
                            .then(defer.resolve);
                    }
                }, true);
                $rootScope.$watch('currentLocale', function (newValue, oldValue) {
                    if ($rootScope.currentLocale && newValue != oldValue) {
                        that.getGameList()
                            .then(applyGameList)
                            .then(defer.resolve);
                    }
                });

                if ($rootScope.currentLocale) {
                    this.getGameList()
                        .then(applyGameList)
                        .then(defer.resolve);
                }

                return defer.promise;
            },

            collections: function ($scope) {
                var game_collections = function () {
                    Games.collections({l: $rootScope.currentLocale}).$promise
                    .then(function(data) {
                        $scope.collections = data;
                    });
                };

                $rootScope.$watch('currentLocale', function (newValue, oldValue) {
                    if ($rootScope.currentLocale && newValue != oldValue) {
                        game_collections();
                    }
                });

                if ($rootScope.currentLocale) {
                    game_collections();
                }
            },

            providers: function ($scope) {
                var game_providers = function () {
                    Games.providers({l: $rootScope.currentLocale}).$promise
                    .then(function(data) {
                        $scope.providers = data;
                    });
                };

                $rootScope.$watch('currentLocale', function (newValue, oldValue) {
                    if ($rootScope.currentLocale && newValue != oldValue) {
                        game_providers();
                    }
                });

                if ($rootScope.currentLocale) {
                    game_providers();
                }
            }
        };
    }]);

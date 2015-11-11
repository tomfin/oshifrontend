CasinoServices
    .factory('Favorite', ['$resource', 'SYSTEM', function ($resource, SYSTEM) {
        return $resource(SYSTEM.URL_API + '/player/favorite_games/:id', {id: '@id'}, {
            list: {method: 'GET', isArray: true},
            add: {method: 'PUT'},
            remove: {method: 'DELETE'}
        });
    }])
    .factory('FavoriteList', ['Favorite', 'Auth', '$rootScope', 'GamesData', function (Favorite, Auth, $rootScope, GamesData) {
        var favorite_list = [],
            user = Auth.user,
            get_list = function () {
                if (!Auth.authorize(Auth.accessLevels.user, user.role)) {
                    return;
                }

                Favorite.list(function (data) {
                    favorite_list = data;
                },
                function(){
                    favorite_list = [];
                });
            },
            add = function (id) {
                Favorite.add({id: id});
                favorite_list.push(id);
            },
            remove = function (id) {
                var game_position = favorite_list.indexOf(id);
                if (game_position > -1) {
                    Favorite.remove({id: id});
                    favorite_list.splice(game_position, 1);
                }
            },
            favorite = function (game) {
                var id;
                if (typeof game == 'object') {
                    id = GamesData.getGameByCurrency(game).id;
                } else {
                    id = game;
                }
                if (isFavorite(game)) {
                    if (typeof game == 'object') {
                        for (var key in game.currencies) {
                            remove(game.currencies[key].id);
                        }
                    } else {
                        remove(id);
                    }
                } else {
                    add(id);
                }
            },
            isFavorite = function (game) {
                var res = false;
                if (typeof game == 'object') {
                    for (var currency in game.currencies) {
                        if (favorite_list.indexOf(game.currencies[currency].id) > -1) {
                            res = true;
                            break;
                        }
                    }
                } else {
                    if (favorite_list.indexOf(game) > -1) {
                        res = true;
                    }
                }

                return res;
            };

        get_list();

        $rootScope.$watch('user', function (newValue, oldValue) {
            if ($rootScope.user && newValue != oldValue) {
                get_list();
            }
        }, true);

        return {
            list: favorite_list,
            favorite: favorite,
            isFavorite: isFavorite,
            get_list: function () {
                return favorite_list
            }
        };
    }]);

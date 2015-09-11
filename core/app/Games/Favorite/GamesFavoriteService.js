CasinoServices
    .factory('Favorite', ['$resource', 'SYSTEM', function ($resource, SYSTEM) {
        return $resource(SYSTEM.URL_API + '/player/favorite_games/:id', {id: '@id'}, {
            list: {method: 'GET', isArray: true},
            add: {method: 'PUT'},
            remove: {method: 'DELETE'}
        });
    }])
    .factory('FavoriteList', ['Favorite', 'Auth', '$rootScope', function (Favorite, Auth, $rootScope) {
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
                Favorite.remove({id: id});
                favorite_list.splice(favorite_list.indexOf(id), 1);
            },
            favorite = function (id) {
                if (isFavorite(id)) {
                    remove(id);
                } else {
                    add(id);
                }
            },
            isFavorite = function (id) {
                var res = false;
                if (favorite_list.indexOf(id) > -1) {
                    res = true;
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

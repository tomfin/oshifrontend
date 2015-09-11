CasinoFilters
    .filter('gameDevice', function() {
        return function(games, value) {
            return games.filter(function (game) {
                return game.devices.indexOf(value) > -1 || !value;
            });
        };
    })
    .filter('gameTitle', function() {
        return function(games, value) {
            return games.filter(function (game) {
                return game.title.toLowerCase().indexOf(value ? value.toLowerCase() : value) > -1;
            });
        };
    })
    .filter('gameCollections', function() {
        return function(games, value) {
            return games.filter(function (game) {
                if (parseInt(value) == value) {
                    value = parseInt(value);
                }

                return game.collections.indexOf(value) > -1 || !value;
            });
        };
    })
    .filter('favoriteGames', function() {
        return function(games, favorite_games, enable) {
            return games.filter(function (game) {
                var res = true;
                res = !(enable && favorite_games.indexOf(game.id) == -1);
                return res;
            });
        };
    })
    .filter('lastPlayedGames', function() {
        return function(games, last_played_games, enable) {
            return games.filter(function (game) {
                return !(enable && last_played_games.indexOf(game.id) === -1);
            });
        };
    })
    .filter('orderByArray', function (){
        return function (games, key, array) {
            return _.sortBy(games, function (game){
                return array.indexOf(game[key]);
            })
        };
    })
    .filter('gameProvider', function() {
        return function(games, value) {
            return games.filter(function (game) {
                return game.provider.toLowerCase() == value || !value;
            });
        };
    })
    .filter('gameCurrency', function() {
        return function(games, value) {
            return games.filter(function (game) {
                return game.currency == value || !value;
            });
        };
    })
    .filter('gameJackpot', function() {
        return function(games, enable) {
            return games.filter(function (game) {
                var res = true;
                if (enable) {
                    res = game.jackpot;
                }
                return res;
            });
        };
    })
    .filter('gameOrder', ['$filter', function($filter) {
        return function(games, value) {
            return $filter('orderBy')(games, function (game) {
                var res = 0;
                if (game.order && game.order[value]) {
                    res = game.order[value];
                }
                return res;
            });
        };
    }])
    .filter('gameOrderAZ', ['$filter', function($filter) {
        return function(games, value) {
            var res = games;
            if (value) {
                res = $filter('orderBy')(games, 'title');
            }
            return res;
        };
    }])
    .filter('collectionsOrder', ['$filter', function($filter) {
        return function(fields, value) {
            return $filter('orderBy')(fields, function (field) {
                return field.position;
            });
        };
    }])
;

CasinoServices
    .factory('GamesCdn', ['SYSTEM', function (SYSTEM) {
        var CDN_PREFIX = SYSTEM.CDN_SERVER.replace(/\/$/, '');

        if (SYSTEM.CDN_ASSETS_PREFIX) {
            CDN_PREFIX = [CDN_PREFIX, SYSTEM.CDN_ASSETS_PREFIX].join('/');
        }

        var ICON_CDN_PREFIX = [CDN_PREFIX, 'i', (SYSTEM.CDN_ASSETS_SIZE || 's1'), ''].join('/'),
            BACK_CDN_PREFIX = [CDN_PREFIX, 'b', ''].join('/');

        return {
            iconURI: function(game) {
                return ICON_CDN_PREFIX + game.identifier.replace('netent', 'fengaming') + '.png';
            },
            backgroundURI: function(game) {
                return BACK_CDN_PREFIX + game.identifier.replace('netent', 'fengaming') + '.jpg';
            },
            iconURIforEach: function(games) {
                for (var i in games) {
                    if (isNaN(parseInt(i))) {
                        continue;
                    }

                    games[i].icon_cdn_path = this.iconURI(games[i]);
                    games[i].background_cdn_path = this.backgroundURI(games[i]);
                }
                return games;
            }
        };
    }]);

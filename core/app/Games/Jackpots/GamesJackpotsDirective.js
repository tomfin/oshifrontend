CasinoDirectives
 .directive('casinoGamesJackpots', [function () {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			type: '@type',
		},
		templateUrl: function (elem, attr) {
			var type = attr.type || 'jackpots';
			return '/app/Games/Jackpots/_' + type + '.html';
		},
		controller: ['$scope', '$rootScope', 'Games', 'Info', 'Jackpots', '$q', 'Auth', 'GamesCdn', function ($scope, $rootScope, Games, Info, Jackpots, $q, Auth, GamesCdn) {
			$scope.accessLevels = Auth.accessLevels;

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

			var games = [],
			 list = [],
			 get_item = function (game) {
				 var res = false;
				 if (game && list[game.currency] && list[game.currency][game.identifier]) {
					 res = list[game.currency][game.identifier];
				 }
				 return res;
			 };

			$q.all({
				games: Games.list({l: $rootScope.currentLocale}).$promise,
                demo: Games.demo({l: $rootScope.currentLocale}).$promise,
				jackpots: Jackpots.list().$promise,
				currencies: Info.currencies().$promise
			}).then(function (result) {
				list = result.jackpots.toJSON();

				for (var key in result.games) {

					var game = result.games[key];

					if (get_item(game)) {

						game.jackpot = get_item(game);
						var currency = result.currencies.filter(function (value) {
							return value.code == game.currency;
						});

						if (currency) {

							game.jackpot = game.jackpot / currency[0].subunits_to_unit;
							game.currency_symbol = currency[0].symbol;
						}

                        var demo_game = gameByIdentifier(result.demo, result.games[key]);

                        if (demo_game) {
                            game.play_url_fun = demo_game.play_url;
                            game.demo_id = demo_game.id;
                        }

						games.push(game);
					}
				}
				GamesCdn.iconURIforEach(games);
				$scope.games = games;
			});

		}]
	};
}]);

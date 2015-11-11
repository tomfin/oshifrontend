CasinoControllers
    .controller('Game', ['$scope', '$rootScope', '$state', '$stateParams', 'Game', '$location', 'Auth', 'GamesData', '$modal', 'SYSTEM',  function ($scope, $rootScope, $state, $stateParams, Game, $location, Auth, GamesData, $modal, SYSTEM) {
        var getGameData = function (game, is_demo) {
            is_demo = is_demo || $rootScope.demo_mode || false;
            var game_identifier = game.identifier.split('/'),
                game_id = is_demo ? game.demo_id : game.id;

            return {type: game_identifier[0], name: game_identifier[1], id: game_id, lang: $rootScope.currentLocale};
        },
        getGameByCurrency = function (game, currency) {
            var game_by_currency;
            if (!$rootScope.data.user.currency) {
                game_by_currency = game.currencies['FUN'];
            } else if (currency && game.currencies[currency]) {
                game_by_currency = game.currencies[currency];
            } else {
                game_by_currency = GamesData.getGameByCurrency(game);
            }
            return game_by_currency;
        },
        showGameDepositModal = function (game) {
            if (SYSTEM.GAME_DEPOSIT_MODAL && SYSTEM.GAME_DEPOSIT_MODAL[game.currency]) {
                var show_modal = false;
                for (var key in $rootScope.data.user.balances) {
                    if ($rootScope.data.user.balances[key].code == game.currency &&
                        ($rootScope.data.user.balances[key].amount_cents/$rootScope.data.user.balances[key].subunits_to_unit < SYSTEM.GAME_DEPOSIT_MODAL[game.currency])) {
                        show_modal = true;
                        break;
                    }
                }
                if (!$rootScope.game_deposit) {
                    $rootScope.game_deposit = {};
                }
                if ($rootScope.game_deposit.modal) {
                    $rootScope.game_deposit.modal.close();
                }

                if (show_modal) {
                    $rootScope.game_deposit.modal = $modal.open({
                        templateUrl: '/app/Game/DepositModal/_game_deposit-modal.html',
                        windowClass: 'modal-deposit-game',
                        controller: 'GameDepositModal'
                    });
                }
            }

        };

        var providersLocationURL = [
            'quickfire',
            'betsoftgaming'
        ];

        $scope.openGame = {
            page: function (game, is_demo) {
                if (providersLocationURL.indexOf(game.provider) > -1 && game.devices.indexOf('mobile') > -1) {
                    if (is_demo) {
                        window.location.href = game.play_url_fun;
                    } else {
                        window.location.href = game.play_url;
                    }
                } else {
                    $state.go('app.game', getGameData(game, is_demo));
                }
            },

            modal: function (game, is_demo) {
                var game_data = getGameData(game, is_demo),
                    path = '#game-' + game_data.type + '-' + game_data.name;
                if (game_data.id) {
                    path += '-' + game_data.id
                }

                path = $location.path() + path;

                return path;
            },

            modalByCurrency: function (game, currency) {
                var game_by_currency = getGameByCurrency(game, currency);

                if (providersLocationURL.indexOf(game.provider) > -1 && game.devices.indexOf('mobile') > -1) {
                    window.location.href = game_by_currency.play_url;
                } else {
                    var path = 'game-' + game.identifier.replace('/', '-') + '-' + game_by_currency.id;
                    showGameDepositModal(game_by_currency);
                    $location.hash(path);
                }
            },

            pageByCurrency: function (game, currency) {
                var game_by_currency = getGameByCurrency(game, currency);
                if (providersLocationURL.indexOf(game.provider) > -1 && game.devices.indexOf('mobile') > -1) {
                        window.location.href = game_by_currency.play_url;
                } else {
                    var game_identifier = game.identifier.split('/');
                    $state.go('app.game', {type: game_identifier[0], name: game_identifier[1], id: game_by_currency.id, lang: $rootScope.currentLocale});
                }
            },


            showModal: function (game, is_demo) {
                var game_path = this.modal(game, is_demo);
                $location.hash(game_path.slice(game_path.indexOf('#') + 1));
            }
        };

        $scope.game_url = false;

        if ($stateParams && $stateParams.type && $stateParams.name) {
            $scope.user = Auth.user;
            $scope.$watch('user.data.email', function (newValue, oldValue) {
                if ($scope.user && newValue != oldValue) {
                    Game.showGame($scope, $stateParams.type + '/' + $stateParams.name, $stateParams.id);
                }
            });
            Game.showGame($scope, $stateParams.type + '/' + $stateParams.name, $stateParams.id);
        }
    }]);

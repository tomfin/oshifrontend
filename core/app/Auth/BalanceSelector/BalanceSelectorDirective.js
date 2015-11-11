CasinoDirectives
    .directive ('casinoBalanceSelector', [ function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: '/app/Auth/BalanceSelector/_balance_selector.html',
        controller: ['$rootScope', '$scope', 'Auth', 'Player', '$location', '$window', function ($rootScope, $scope, Auth, Player, $location, $window) {
            $scope.data = $rootScope.data;
            $scope.user = Auth.user;

            var merge = function() {
                var obj = {},
                    i = 0,
                    il = arguments.length,
                    key;
                for (; i < il; i++) {
                    for (key in arguments[i]) {
                        if (arguments[i].hasOwnProperty(key)) {
                            obj[key] = arguments[i][key];
                        }
                    }
                }
                return obj;
            };

            var setBalance = function () {
                var balances = [];
                if (!Auth.authorize(Auth.accessLevels.anon)) {
                    if ($rootScope.Info.currencies) {
                        Player.balance(function (data) {
                            data.forEach(function (value) {

                                var currency_data = merge(
                                    value,
                                    $rootScope.Info.currencies.filter(function (currency) {
                                        return currency.code == value.currency;
                                    })[0]);

                                if (currency_data.code == "BTC" && currency_data.amount_cents < currency_data.subunits_to_unit && currency_data.amount_cents != 0) {
                                    currency_data.subunits_to_unit = 100000;
                                    currency_data.symbol = 'mBTC';
                                    currency_data.currency = 'mBTC';
                                }
                                balances.push(currency_data);
                            });
                            $scope.balances = balances;
                            $rootScope.data.user.balances = balances;
                        });
                    }
                } else {
                    $scope.balances = balances;
                }
            };

            $scope.changeCurrency = function (code) {
                $rootScope.data.user.currency = code;
            };

            $scope.$watch('user.data', function () {
                setBalance();
            });

            $rootScope.$watch('Info.currencies', function () {
                setBalance();
            });

            $rootScope.$watch(function () {return $location.hash()}, function (newLocation, oldLocation) {
                var hash = $window.location.hash.replace(/%2F/g, '/');
                if (hash == '' || hash == '#%20') {
                    setBalance();
                }
            });

            $scope.$on('$locationChangeSuccess', function(event) {
                var hash = $window.location.hash.replace(/%2F/g, '/');
                if (hash == '' || hash == '#%20') {
                    setBalance();
                }
            });
        }]
    };
}]);

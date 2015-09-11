CasinoDirectives
    .directive ('casinoBalanceSelector', [ function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: '/app/Auth/BalanceSelector/_balance_selector.html',
        controller: ['$rootScope', '$scope', 'Auth', 'Player', function ($rootScope, $scope, Auth, Player) {
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
                                balances.push(
                                    merge(
                                        value,
                                        $rootScope.Info.currencies.filter(function (currency) {
                                            return currency.code == value.currency;
                                        })[0])
                                );
                            });
                            $scope.balances = balances;
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
        }]
    };
}]);

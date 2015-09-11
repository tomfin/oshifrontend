CasinoDirectives
    .directive ('casinoBitcoinConverter', [ function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: '/app/Blocks/BitcoinConverter/_bitcoinConverter.html',
        controller: ['$scope', 'BitcoinConverter', function ($scope, BitcoinConverter) {
            var
                btc = 0,
                currency = 1000,
                getPrice = function () {
                    BitcoinConverter.get(function(data) {
                        $scope.price = data.last;
                        calculateBTC();
                    });
                },
                calculateBTC = function () {
                    btc = ($scope.currency / $scope.price * 1000).toFixed(2);
                    $scope.btc = btc;
                    currency = $scope.currency;
                },
                calculateCurrency = function () {
                    currency = ($scope.btc * $scope.price / 1000).toFixed(2);
                    $scope.currency = currency;
                    btc = $scope.btc;
                };

            $scope.price = 0;
            $scope.btc = btc;
            $scope.currency = currency;
            $scope.refreshRate = getPrice;
            getPrice();

            $scope.$watch('btc', function () {
                if ($scope.btc != btc) {
                    calculateCurrency();
                }
            });

            $scope.$watch('currency', function () {
                if ($scope.currency != currency) {
                    calculateBTC();
                }
            });

        }]
    };
}]);
CasinoControllers
    .controller('GameDepositModal', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $scope.closeWindow = function () {
            $rootScope.game_deposit.modal.close();
        };
    }]);





















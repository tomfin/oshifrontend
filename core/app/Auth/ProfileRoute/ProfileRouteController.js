CasinoControllers
    .controller('ProfileRoutes', ['$scope', '$rootScope', 'Auth', 'Info', function ($scope, $rootScope, Auth, Info) {
        $scope.accessLevels = Auth.accessLevels;
        $scope.currentCurrency = $rootScope.data.user.currency;
        $scope.profileRoutes = $scope.profile = Info.profile_routes();
        $scope.data = $rootScope.data;

        $rootScope.$watch('data.user.currency', function (newValue, oldValue) {
            if ($rootScope.currentLocale && newValue != oldValue) {
                $scope.currentCurrency = $rootScope.data.user.currency;
            }
        });
    }]);


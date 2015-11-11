CasinoControllers
    .controller('AuthModal', ['$scope', '$rootScope', 'Auth', 'AuthModalService', function ($scope, $rootScope, Auth, AuthModalService) {
        $scope.accessLevels = Auth.accessLevels;
        $scope.auth_modal = {
            showLogin: AuthModalService.showLogin,
            showRegistration: AuthModalService.showRegistration
        };
        $scope.closeWindow = function () {
            $rootScope.mainModal.close();
        };
    }]);





















CasinoServices
    .factory('AuthModalService', ['$rootScope', '$modal', function ($rootScope, $modal) {
        var showLogin = function (errors) {

            $rootScope.mainModal.close();
            $rootScope.mainModal.modal = $modal.open({
                templateUrl: '/app/Auth/Modal/_login-modal.html',
                windowClass: 'modal-login',
                controller: 'LoginCtrl'
            });
        },
        showRegistration = function () {
            $rootScope.mainModal.close();
            $rootScope.mainModal.modal = $modal.open({
                templateUrl: '/app/Auth/Modal/_registration-modal.html',
                windowClass: 'modal-registration',
                controller: 'Registration'
            });
        };

        return {
            showLogin: showLogin,
            showRegistration: showRegistration
        }
    }]);
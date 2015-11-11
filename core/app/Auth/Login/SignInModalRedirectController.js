CasinoControllers
    .controller('SignInRedirectController', ['$scope', '$rootScope', '$state', 'AuthModalService', function ($scope, $rootScope, $state, AuthModalService) {
            $state.transitionTo('home', {lang: $rootScope.currentLocale}).finally(function () {
                AuthModalService.showLogin();
            });

    }]);

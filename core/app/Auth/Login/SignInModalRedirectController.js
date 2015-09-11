CasinoControllers
    .controller('SignInRedirectController', ['$scope', '$state', 'AuthModalService', function ($scope, $state, AuthModalService) {
            $state.transitionTo('home').finally(function () {
                AuthModalService.showLogin();
            });

    }]);
CasinoControllers
    .controller('SignUpRedirectController', ['$scope', '$state', 'AuthModalService', function ($scope, $state, AuthModalService) {
        $state.transitionTo('home', $state.params).finally(function () {
            AuthModalService.showRegistration();
        });

    }]);
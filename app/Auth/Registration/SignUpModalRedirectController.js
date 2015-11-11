CasinoControllers
    .controller('SignUpRedirectController', ['$scope', '$state', 'AuthModalService', function ($scope, $state, AuthModalService) {
        $state.transitionTo('home-rego', $state.params).finally(function () {
            AuthModalService.showRegistration();
        });

    }]);
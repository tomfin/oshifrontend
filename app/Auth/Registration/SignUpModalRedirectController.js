CasinoControllers
    .controller('SignUpRedirectController', ['$scope', '$state', '$rootScope', 'AuthModalService', function ($scope, $state, $rootScope, AuthModalService) {
        $state.transitionTo('home-rego', $state.params).finally(function () {
            AuthModalService.showRegistration();
        });
        $rootScope.$watch('data.user', function(){
            if ($rootScope.data.user.email) {
                $rootScope.mainModal.close();
            }
        });

    }]);
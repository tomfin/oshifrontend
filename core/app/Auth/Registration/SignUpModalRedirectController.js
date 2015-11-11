CasinoControllers
    .controller('SignUpRedirectController', ['$scope', '$rootScope', '$state', 'AuthModalService', function ($scope, $rootScope, $state, AuthModalService) {
        $state.params.lang = $rootScope.currentLocale;
        $state.transitionTo('home', $state.params).finally(function () {
            AuthModalService.showRegistration();
        });
        $rootScope.$watch('data.user', function(){
            if ($rootScope.data.user.email) {
                $rootScope.mainModal.close();
            }
        });
    }]);

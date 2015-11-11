CasinoControllers
    .controller('Registration', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
        $rootScope.$watch('data.user', function(){
            if ($rootScope.data.user.email) {
                $state.go('home', {lang:$rootScope.currentLocale});
            }
        });
    }]);

CasinoControllers
    .controller('SignInRedirectController', ['$scope', '$rootScope', '$state', '$timeout', 'AuthModalService', function ($scope, $rootScope, $state, $timeout, AuthModalService) {
            $state.transitionTo('home', {lang: $rootScope.currentLocale}).finally(function () {
            	$timeout(function() {
            		AuthModalService.showLogin();
            	}, 500);
            });

    }]);

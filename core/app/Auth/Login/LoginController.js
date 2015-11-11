CasinoControllers
    .controller('LoginCtrl', ['$scope', '$state', 'Auth', '$rootScope', 'SYSTEM', function ($scope, $state, Auth, $rootScope, SYSTEM) {
        var login = {};
        $scope.login = login;
        login.data = {user:{email: '', password: ''}};
        login.errors = $rootScope.errorsLoginForm;

        login.submit = function (showModal) {
            showModal = showModal || false;

            Auth.login(login, function (){
                var redirect_state = SYSTEM.AFTER_LOGIN_REDIRECT || "home";
                $rootScope.mainModal.close();
                $rootScope.errorsLoginForm = '';

                if ($state.current.name == 'app.users_sign_in') {
                    $state.go(redirect_state, {lang: $rootScope.currentLocale});
                }
            }, function (errors){

                if (showModal) {
                    $rootScope.errorsLoginForm = errors;
                    $state.go("app.users_sign_in", {lang: $rootScope.currentLocale});
                }
            });
        };

        login.logout = function () {
            Auth.logout();
        };

        $scope.user = Auth.user.data;

        $scope.$watch(
            'user', function () {
                redirectForAuthorized();
            }, true
        );

        function redirectForAuthorized() {
            if (!Auth.authorize(Auth.accessLevels.anon)) {
                //TODO add as param
                //$state.go('home');
                return true;
            }
            return false;
        }

        redirectForAuthorized();
    }]);

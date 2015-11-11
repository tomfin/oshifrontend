CasinoControllers
    .controller('UnlockController', ['$scope', '$rootScope', 'User', '$state', '$location', 'Notification', function ($scope, $rootScope, User, $state, $location, Notification) {
        var unlock = {};
        $scope.unlock = unlock;

        unlock.data = {user: {},unlock_token: $location.search().unlock_token, errors: {}};

        if ($location.search().unlock_token) {
            User.unlock_email(unlock.data, function(answer) {
                $state.go('home', {lang: $rootScope.currentLocale});
            }, function(error) {
                //$state.go('app.users_unlock_new', {lang: $rootScope.currentLocale});
                unlock.data.errors = error.data.errors;
            });
        } else if ($state.current.name == "app.users_unlock") {
            $state.go('app.users_unlock_new', {lang: $rootScope.currentLocale});
        }

        unlock.data.user.email = '';

        unlock.submit = function () {
            User.sent_unlock_email(unlock.data, function(answer) {
                Notification.show('devise.unlocks.send_instructions', {classes: 'alert-success'});
                $state.go('home', {lang: $rootScope.currentLocale});
            }, function(error) {
                //$state.go('app.users_unlock_new', {lang: $rootScope.currentLocale});
                unlock.data.errors = error.data.errors;
            });
        };
    }]);

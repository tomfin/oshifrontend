CasinoControllers
    .controller('UnlockController', ['$scope', 'User', '$state', '$location', 'Notification', function ($scope, User, $state, $location, Notification) {
        var unlock = {};
        $scope.unlock = unlock;

        unlock.data = {user: {},unlock_token: $location.search().unlock_token, errors: {}};

        if ($location.search().unlock_token) {
            User.unlock_email(unlock.data, function(answer) {
                $state.go('home');
            }, function(error) {
                $state.go('users_unlock_new');
                unlock.data.errors = error.data.errors;
            });
        } else if ($state.current.name == "users_unlock") {
            $state.go('users_unlock_new');
        }

        unlock.data.user.email = '';

        unlock.submit = function () {
            User.sent_unlock_email(unlock.data, function(answer) {
                Notification.show('devise.unlocks.send_instructions', {classes: 'alert-success'});
                $state.go('home');
            }, function(error) {
                $state.go('users_unlock_new');
                unlock.data.errors = error.data.errors;
            });
        };


    }]);
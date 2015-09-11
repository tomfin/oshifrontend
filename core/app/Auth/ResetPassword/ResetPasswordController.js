CasinoControllers
    .controller('ResetPasswordController', ['$scope', 'User', '$state', '$location', 'Notification', function ($scope, User, $state, $location, Notification) {
        var reset_password = {};
        $scope.reset_password = reset_password;

        reset_password.data = {user:{password:'', password_confirmation:'', reset_password_token: $location.search().reset_password_token}, errors:{}};

        reset_password.submit = function () {
                User.reset_password(reset_password.data, function(answer) {
                    Notification.show('devise.passwords.updated_not_active', {classes: 'alert-success'});
                    $state.go('home');
                }, function(error) {
                    reset_password.data.errors = error.data.errors;
                });
            };
    }]);
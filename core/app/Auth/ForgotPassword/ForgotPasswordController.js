CasinoControllers
    .controller('ForgotPassword', ['$scope', 'User', '$state', 'Notification', '$rootScope', function ($scope, User, $state, Notification, $rootScope) {
        var forgot_password = {};
        $scope.forgot_password = forgot_password;

        forgot_password.data = {user:{email:''}, errors:{}};

        forgot_password.submit = function () {
                User.forgot_password(forgot_password.data, function(answer) {
                    Notification.show('devise.passwords.send_instructions', {classes: 'alert-success'});
                    $state.go('home', {lang: $rootScope.currentLocale});
                }, function(error) {
                    forgot_password.data.errors = error.data.errors;
                });
            };
    }]);

CasinoControllers
    .controller('ConfirmationController', ['$scope', '$rootScope', '$timeout', 'Auth', 'User', '$state', '$location', 'Notification', '$filter', 'SYSTEM', function ($scope, $rootScope, $timeout, Auth, User, $state, $location, Notification, $filter, SYSTEM) {
        var confirmation = {};
        $scope.confirmation = confirmation;
        var checked = false;
        var redirect_state = SYSTEM.AFTER_LOGIN_REDIRECT || "home";

        confirmation.data = {user: {}, confirmation_token: $location.search().confirmation_token, errors: {}};
        confirmation.data.user.email = '';

        $rootScope.$on('cfpLoadingBar:completed', function () {
            if ($location.search().confirmation_token && !checked) {
                checked = true;

                $timeout(function () {
                    sendEmailConfirmation();
                }, 200);
            } else if ($state.current.name == "users_confirmation" && !$location.search().confirmation_token) {
                checked = true;
                $state.go('app.users_confiramation_new', {lang: $rootScope.currentLocale});
            }
        });


        function sendEmailConfirmation() {
            var data = {};

            if (confirmation && confirmation.data) {
                data.confirmation_token = confirmation.data.confirmation_token;
            }

            User.email_confirmation(data, function (answer) {

                Notification.show('devise.confirmations.confirmed', {classes: 'alert-success'});
                Auth.check(function (data) {
                    $rootScope.$broadcast("successLoginAfterConfirmation", data);
                    showIncomeAccessAff(data);
                });

                $state.go(redirect_state, {lang: $rootScope.currentLocale});
            }, function(error) {
                Object.keys(error.data).forEach(function (key){
                    var message = $filter('translate')('activerecord.attributes.user.' + key) + " " + error.data[key][0];
                    Notification.show(message, {classes: 'alert-error'});
                });
                //$state.go('app.users_confirmation_new', {lang: $rootScope.currentLocale});
                confirmation.data.errors = error.data.errors;
            });
        }

        confirmation.submit = function () {
            User.sent_email_confirmation(confirmation.data, function (answer) {
                Notification.show('devise.confirmations.send_instructions', {classes: 'alert-success'});
                $state.go(redirect_state, {lang: $rootScope.currentLocale});
            }, function(error) {
                $state.go('app.users_confirmation_new', {lang: $rootScope.currentLocale});
                confirmation.data.errors = error.data.errors;
            });
        };

        var showIncomeAccessAff = function (player) {
            if (SYSTEM.INCOME_ACCESS_AFF_SERVER && SYSTEM.INCOME_ACCESS_AFF_SERVER != '' && player && player.id) {
                var iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = SYSTEM.INCOME_ACCESS_AFF_SERVER + '/Processing/Pixels/Registration.ashx?PlayerID=' + player.id + '&mid=2';
                document.body.appendChild(iframe);
            }
        }
    }]);

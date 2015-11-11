CasinoControllers
    .controller('Support', ['$scope', '$rootScope', 'Auth', '$state', 'Contact', 'Notification', function ($scope, $rootScope, Auth, $state, Contact, Notification) {
        var support = {data:{contact:{email: '', content: ''}}};
        $scope.user = Auth.user;

        $scope.$watchCollection('user', function (){
            if ($scope.user.data && $scope.user.data.email) {
                support.data.contact.email = $scope.user.data.email;
            }
        });

        $scope.support = support;

        support.submit = function () {
            Contact.post(support.data, function () {
                $state.go('home', {lang: $rootScope.currentLocale});
                Notification.show('notification.contact_form.sender_notice', {classes: 'alert-success'});
                support.data.contact.content = '';
            }, function (req) {
                $scope.support.errors = req.data.errors;
            });
        };
    }]);

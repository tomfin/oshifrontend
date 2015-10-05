CasinoDirectives
    .directive ('casinoFormRegistration', ['FormRegistrationService', function (FormRegistrationService) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            columns: '@columns',
            checkboxAfter: '@checkboxAfter'
        },
        templateUrl: '/app/Auth/Registration/FormRegistration/_form_registration.html',
        controller: 'FormRegistration'
    };
}]);

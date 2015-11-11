CasinoControllers
    .controller('FormRegistration', ['$scope', '$rootScope', '$state', 'FormRegistrationService', function ($scope, $rootScope, $state, FormRegistrationService) {
        if (!$scope.columns) {
            $scope.columns = 1;
        }

        FormRegistrationService.init().then(function (){
            FormRegistrationService.setErrors($state.params.errors);

            $scope.registration = FormRegistrationService.registration;
            if (!$scope.checkboxAfter) {
                $scope.registrationFields = FormRegistrationService.getFieldsColumn(FormRegistrationService.getFields(), $scope.columns);

            } else {
                var fields = FormRegistrationService.getFields().filter(function (field){
                        return field.localData.type != 'checkbox';
                    });
                var fields_checkbox = FormRegistrationService.getFields().filter(function (field){
                        return field.localData.type == 'checkbox';
                    });
                var columns = parseInt($scope.checkboxAfter) == $scope.checkboxAfter ? $scope.checkboxAfter : $scope.columns;

                $scope.registrationFields = FormRegistrationService.getFieldsColumn(fields, $scope.columns);
                $scope.registrationFieldsCheckbox = FormRegistrationService.getFieldsColumn(fields_checkbox, columns);

            }
        });

        $scope.submit = FormRegistrationService.submit;
    }]);

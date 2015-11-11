CasinoServices
    .factory('FormRegistrationService', ['$rootScope', 'Auth', 'Info', 'REGISTRATION', '$translate', '$q', 'Notification', '$state', function ($rootScope, Auth, Info, REGISTRATION, $translate, $q, Notification, $state) {
        var registration = {
            data: {},
            fields: [],
            errors: {}
        };

        var registration_constant = {};
        for (var i = 0, length = REGISTRATION.length; i < length; i++){
            REGISTRATION[i].order = i;
            registration_constant[REGISTRATION[i].field] = REGISTRATION[i];
        }


        var init = function (){
            var defer = $q.defer();
            Info.profile_fields().$promise
                .then(function(data){
                    var fields = data.map(function (profile_field){
                        if (registration_constant[profile_field.field]) {
                            profile_field.localData = registration_constant[profile_field.field];
                        }

                        if (!profile_field[profile_field.scope]) {
                            profile_field[profile_field.scope] = [];
                        }
                        profile_field.name = profile_field.field;
                        profile_field[profile_field.scope].push(profile_field);

                        profile_field = addExternal(profile_field);

                        return profile_field
                    });

                    fields = _.sortBy(
                        fields,
                        function (field){
                            return field.localData.order;
                        }
                    );

                    registration.fields = fields;
                    defer.resolve(fields);
                });
            return defer.promise;
        };


        var getFields = function (){
            return registration.fields;
        };

        var getFieldsColumn = function (fields, count){
            var coll = -1;
            var column_element = Math.ceil(fields.length / count);
            var group_fields = [];

            fields.forEach(function (field, index){
                if (index % column_element == 0){
                    coll++;
                    group_fields[coll] = [];
                }
                group_fields[coll].push(field);

            });

            return group_fields;
        };

        var submit = function () {
            var params = {
                data: {}
            };

            params.data.user = registration.data.user || {};
            if (registration.data.profile) {
            params.data.user.profile_attributes = {};
                Object.keys(registration.data.profile).forEach(function (key) {
                    params.data.user.profile_attributes[key] = registration.data.profile[key];
                });
            }

            Auth.registration(params, function () {
                Notification.show('devise.registrations.signed_up_but_unconfirmed', {classes: 'alert-success'});
                $rootScope.mainModal.close();
                //TODO rewrite after registration action may be use default
                $state.go('home');
            }, function (errors){

                registration.errors = errors;
                if (errors.profile) {
                    for (key in errors.profile) {
                        registration.errors[key] = errors.profile[key];
                    }
                    delete errors.profile;
                }
            });
        };

        var setErrors = function (errors){
            registration.errors = errors;
        };

        function addExternal(field) {

            var getCurrency = function (){
                    var currencies = $rootScope.Info.currencies,
                        result = {};

                    if (currencies) {
                        Object.keys(currencies).forEach(function (key){
                            result[currencies[key].code] = currencies[key].code;
                        });
                    }

                    return result;
                },

                getGender = function (){
                    return {
                        m : $translate.instant('common.genders.m'),
                        f : $translate.instant('common.genders.f')
                    };
                },

                getLanguages = function (){
                    var languages = $rootScope.Info.locales,
                        result = {};

                    if (languages) {
                        Object.keys(languages).forEach(function (key){
                            result[languages[key]] = languages[key].name_in_locale;
                        });
                    }
                    return result;
                },
                getTimeZone = function (){
                    var time_zones = $rootScope.Info.time_zones,
                        result = {};

                    if (time_zones) {
                        Object.keys(time_zones).forEach(function (key){
                            result[time_zones[key].code] = time_zones[key].name;
                        });
                    }
                    return result;
                },
                getCountries = function (){
                    var countries = $rootScope.Info.countries,
                        result = {};

                    if (countries) {
                        Object.keys(countries).forEach(function (key){
                            result[countries[key].code] = countries[key].name;
                        });
                    }
                    return result;
                };



            switch (field.field) {
                case "gender":
                    field.inclusion = {};
                    field.inclusion.in = getGender();

                    $rootScope.$on('$translateChangeSuccess', function () {
                        field.inclusion.in = getGender();
                    });
                    break;

                case "currency":
                    field.inclusion = {};
                    field.inclusion.in = getCurrency();

                    $rootScope.$watch('Info.currencies', function () {
                        field.inclusion.in = getCurrency();
                    }, true);
                    break;

                case 'language':
                    field.inclusion = {};
                    field.inclusion.in = getLanguages();

                    $rootScope.$on('$translateChangeSuccess', function () {
                        field.inclusion.in = getLanguages();
                    }, true);
                    break;

                case 'time_zone':
                    field.inclusion = {};
                    field.inclusion.in = getTimeZone();

                    $rootScope.$watch('Info.time_zones', function () {
                        field.inclusion.in = getTimeZone();
                    }, true);
                    break;

                case 'country':
                    field.inclusion = {};
                    field.inclusion.in = getCountries();

                    $rootScope.$watch('Info.countries', function (){
                        field.inclusion.in = getCountries();
                    }, true);
                    break;

            }
            return field;
        }


        return {
            init: init,
            getFieldsColumn: getFieldsColumn,
            getFields: getFields,
            submit: submit,
            setErrors: setErrors,
            registration: registration
        };
    }]);

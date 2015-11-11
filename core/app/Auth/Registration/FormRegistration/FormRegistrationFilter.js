CasinoFilters
    .filter('registrationOrder', ['$filter', function($filter) {
        return function(fields, value) {
            return $filter('orderBy')(fields, function (field) {
                return field.localData.order;
            });
        };
    }])
;
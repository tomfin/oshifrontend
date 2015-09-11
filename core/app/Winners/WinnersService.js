CasinoServices
    .factory('Winners', ['$resource', 'SYSTEM', function ($resource, SYSTEM) {
        return $resource(SYSTEM.URL_API + '/stats/winners/:action/:currency', {}, {
            top: {method: 'GET', params: {action: 'top'}, isArray: true},
            latest: {method: 'GET', params: {action: 'latest'}, isArray: true}
        });
    }]);

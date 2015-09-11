CasinoServices
    .factory('Contact', ['$resource', 'SYSTEM', function ($resource, SYSTEM) {
        return $resource(SYSTEM.URL_API + '/send_contact_message', {}, {
            post: {method: 'post', params: {}}
        });
    }])
;

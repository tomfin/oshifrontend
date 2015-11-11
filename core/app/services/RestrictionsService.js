CasinoServices
    .factory('Restrictions', ['$rootScope', function ($rootScope) {
        var data = [],
            resources = {
                game: function (game) {
                    for (var key in data.game) {
                        var allowed = false;
                        for (var field in data.game[key]) {
                            if (game[field] != data.game[key][field]) {
                                allowed = true;
                                break;
                            }
                        }
                        if (!allowed){
                            return key;
                        }
                    }
                    return false;
                },
                currency: function (currency) {
                    var is_restricted = false;
                    for (var key in data.currency) {
                        if (data.currency[key].code.indexOf(currency) > -1) {
                            is_restricted = true;
                        }
                    }
                    return is_restricted;
                }
            };


        return {
            init: function(restrictions, marks) {
                for (var key in marks) {
                    for (var restrictions_key in restrictions) {
                        if (restrictions[restrictions_key].mark == marks[key]) {
                            if (!data[restrictions[restrictions_key].resource]) {
                                data[restrictions[restrictions_key].resource] = {};
                            }
                            data[restrictions[restrictions_key].resource][marks[key]] = restrictions[restrictions_key].scope;
                        }
                    }
                }
                $rootScope.data.restrictions = data;
            },

            isRestricted: function (name, item) {
                var is_restricted = false;

                if (data[name]) {
                    is_restricted = resources[name](item);
                }

                return is_restricted;
            }
        }
    }])
;

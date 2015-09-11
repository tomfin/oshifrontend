'use strict';

CasinoServices
    .factory('Auth', ['$rootScope', 'User', 'Player', 'Info', '$window', function ($rootScope, User, Player, Info, $window) {

        var accessLevels = routingConfig.accessLevels,
            userRoles = routingConfig.userRoles,
            currentUser = {role: userRoles.public, data:{}};

        function changeUser(user) {
            user = user || {};

            if (user.email){
                currentUser.role = userRoles.user;
                currentUser.data = user;
            } else {
                currentUser.role = userRoles.public;
                currentUser.data = {};
            }

            if (user.currency) {
                $rootScope.data.user = user;
            } else {
                $rootScope.data.user = {
                    currency : false
                }

            }
            stats();
        };

        function stats () {
            Player.stats(function (data){
                data = data.toJSON();
                if (!$window.dataLayer) {
                    $window.dataLayer = [];
                }
                $window.dataLayer.push(data);
            });
        };

        return {
            check: function (callback) {
                callback = callback || function () {};
                var request = Player.get().$promise;
                request.then(function (data){
                    changeUser(data);
                    callback(data);
                });

                return request;
            },
            login: function (user, success, error) {
                var that = this;
                User.sign_in(
                    user.data,
                    function (data) {
                        if (data.redirect) {
                            $window.location.href = data.redirect;
                        } else {
                            that.check(success);
                        }
                    },
                    function (res) {
                        if (res.data.errors) {
                            user.errors = res.data.errors;
                            error && error(res.data.errors);
                        }
                    }
                );
            },
            registration: function (user, success, error) {
//                this.check();
                User.sign_up(
                    user.data,
                    function (data) {
                        success && success(data);
                    },
                    function (res) {

                        if (res.data.errors) {
                            user.errors = res.data.errors;
                            error && error(res.data.errors);
                        }
                    }
                );
            },

            logout: function (success, error) {
                User.sign_out(
                    function (data) {
                        changeUser();
                        success && success(data);
                    },
                    error
                );
                changeUser();
            },
            authorize: function (accessLevel, role) {
                if (role === undefined) {
                    role = currentUser.role;
                }

                return accessLevel.bitMask & role.bitMask;
            },
            changeUser: function (entity) {
                changeUser(entity);
            },
            accessLevels: accessLevels,
            userRoles: userRoles,
            user: currentUser
        };
    }]);

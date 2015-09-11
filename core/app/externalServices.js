//'use strict';
CasinoServices
    .factory('External', ['SYSTEM', '$window', '$rootScope', function (SYSTEM, $window, $rootScope) {
        var services = {
            GTM: function() {
                $window.dataLayer || ($window.dataLayer = []);
                if (SYSTEM.GOOGLE_TAG_MANAGER_ID) {
                    $rootScope.$on("preloadHide", function() {
                        (function (w, d, s, l, i) {
                            w[l] = w[l] || [];
                            w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
                            var f = d.getElementsByTagName(s)[0],
                                j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
                            j.async = true;
                            j.src =
                                '//www.googletagmanager.com/gtm.js?id=' + i + dl;
                            f.parentNode.insertBefore(j, f);
                        })(window, document, 'script', 'dataLayer', SYSTEM.GOOGLE_TAG_MANAGER_ID);
                    });
                }
            },
            Livechatinc: function () {
                if (SYSTEM.LIVECHATIC) {
                    $window. __lc = SYSTEM.LIVECHATIC;

                    var changeUser = function () {
                        if ($rootScope.user.data && $rootScope.user.data.email) {
                            var name = $rootScope.user.data.nickname;

                            if ($rootScope.user.data.first_name && $rootScope.user.data.last_name) {
                                name = $rootScope.user.data.first_name + ' ' + $rootScope.user.data.last_name;
                            }

                            $window.__lc.visitor = {
                                name: name,
                                email: $rootScope.user.data.email
                            }
                        }
                    };
                    $rootScope.$watch('user', function (newValue, oldValue) {
                        if ($rootScope.user && newValue != oldValue) {
                            changeUser();
                        }
                    }, true);

                    changeUser();
                    $rootScope.$on("preloadHide", function() {
                        var lc = document.createElement('script');
                        lc.type = 'text/javascript';
                        lc.async = true;
                        lc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.livechatinc.com/tracking.js';
                        var s = document.getElementsByTagName('script')[0];
                        s.parentNode.insertBefore(lc, s);
                    });
                }
            }

        };
        return {
            services: services,
            init: function() {
                for (var key in services) {
                    services[key]();
                }
            }
        }
    }])
;

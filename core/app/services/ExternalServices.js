//'use strict';
CasinoServices
 .factory('External', ['SYSTEM', '$window', '$rootScope', function (SYSTEM, $window, $rootScope) {
	 var services = {
		 GTM: function () {
			 $window.dataLayer || ($window.dataLayer = []);
			 if (SYSTEM.GOOGLE_TAG_MANAGER_ID) {
				 $rootScope.$on("preloadHide", function () {
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
				 $window.__lc = SYSTEM.LIVECHATIC;

				 var changeUser = function () {
					 if ($rootScope.user.data && $rootScope.user.data.email) {
						 var name = $rootScope.user.data.nickname;

						 if ($rootScope.user.data.first_name && $rootScope.user.data.last_name) {
							 name = $rootScope.user.data.first_name + ' ' + $rootScope.user.data.last_name;
						 }

						 $window.__lc.visitor = {
							 name: name || "",
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
				 $rootScope.$on("preloadHide", function () {
					 var lc = document.createElement('script');
					 lc.type = 'text/javascript';
					 lc.async = true;
					 lc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.livechatinc.com/tracking.js';
					 var s = document.getElementsByTagName('script')[0];
					 s.parentNode.insertBefore(lc, s);
				 });
			 }
		 },
		 Zopim: function () {
			 if (SYSTEM.ZOPIM) {

				 function changeUser() {
					 if ($rootScope.user.data && $rootScope.user.data.email) {
						 var name = $rootScope.user.data.nickname;

						 if ($rootScope.user.data.first_name && $rootScope.user.data.last_name) {
							 name = $rootScope.user.data.first_name + ' ' + $rootScope.user.data.last_name;
						 }

						 if (!$zopim.livechat) {
							 $zopim(function () {
								 $zopim.livechat.setName(name || "");
								 $zopim.livechat.setEmail($rootScope.user.data.email);
								 setLocale();
							 });
						 } else {
							 $zopim.livechat.setName(name || "");
							 $zopim.livechat.setEmail($rootScope.user.data.email);
							 setLocale();
						 }
					 }

				 }

				 var setLocale = function () {
					 $zopim.livechat.setLanguage(getLocale($rootScope.currentLocale));
				 };

				 function getLocale(localeID) {
					 var result = "en";
					 switch (localeID) {
						 case "zh":
							 result = "zh_CN";
							 break;
					 }
					 return result;
				 }

				 $rootScope.$watch('user', function (newValue, oldValue) {
					 if ($rootScope.user && newValue != oldValue) {
						 changeUser();
					 }
				 }, true);

				 $rootScope.$watch('currentLocale', function (newValue, oldValue) {
					 if ($rootScope.currentLocale && newValue !== oldValue) {
						 setLocale();
					 }
				 }, true);

				 $rootScope.$on("preloadHide", function () {
					 window.$zopim || (function (d, s) {
						 var z = $zopim = function (c) {
							  z._.push(c)
						  },
						  $ = z.s = d.createElement(s),
						  e = d.getElementsByTagName(s)[0];
						 z.set = function (o) {
							 z.set._.push(o)
						 };
						 z._ = [];
						 z.set._ = [];
						 $.async = true;
						 $.setAttribute('charset', 'utf-8');
						 $.src = "//v2.zopim.com/?" + SYSTEM.ZOPIM;
						 z.t = +new Date;
						 $.type = "text/javascript";
						 e.parentNode.insertBefore($, e);
						 changeUser();
					 })(document, "script");
				 });
			 }
		 }

	 };
	 return {
		 services: services,
		 init: function () {
			 for (var key in services) {
				 services[key]();
			 }
		 }
	 }
 }]);

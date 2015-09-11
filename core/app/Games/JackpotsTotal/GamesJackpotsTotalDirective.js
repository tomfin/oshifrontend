CasinoDirectives
 .directive('casinoJackpotsTotal', [function () {
	 return {
		 restrict: 'E',
		 replace: true,
		 scope: {
			 defaultcurrency: "@defaultcurrency"
		 },
		 templateUrl: function (elem, attr) {
			 return '/app/Games/JackpotsTotal/_jackpots_total.html';
		 },
		 controller: ['$rootScope', '$scope', '$rootScope', 'Info', 'Jackpots', '$q', '$filter', function ($rootScope, $scope, $rootScope, Info, Jackpots, $q, $filter) {
			 var jackpotIsUpdated = false;
			 function updateJackpot() {
				 jackpotIsUpdated = true;

				 var scopeUserCurrency = $rootScope.user.data.currency;
				 var userCurrency = scopeUserCurrency ? scopeUserCurrency : null;
				 var defaultCurrencyForIncorrectCurrency = "EUR";
				 var defaultCurrency = (userCurrency || $scope.defaultcurrency || defaultCurrencyForIncorrectCurrency).toUpperCase();
				 var totalJackpot = 0;
				 var currencySymbol;
				 var key;
				 var currencyInfo;
				 var currencies;
				 var jackpots;
				 var jackpotsInfo;
				 var subunits;
				 var jackpotValue;
				 var currencyFilter = $filter("casino_currency");
				 var totalJackpotFormatted;
				 var totalJackpotFractional;
				 var fractionalSymbolIndex;
				 var fractionalSymbol = ".";
				 var totalJackpotFullFormatted;

				 $q.all({
					 jackpots: Jackpots.list().$promise,
					 currencies: Info.currencies().$promise
				 }).then(function (result) {
					 jackpots = result.jackpots;
					 currencies = result.currencies;

					 defaultCurrency = jackpots[defaultCurrency] ? defaultCurrency : defaultCurrencyForIncorrectCurrency;

					 for (key in currencies) {
						 currencyInfo = currencies[key];
						 if (currencyInfo.code === defaultCurrency) {
							 subunits = currencyInfo.subunits_to_unit;
							 currencySymbol = currencyInfo.symbol;
							 break;
						 }
					 }

					 jackpotsInfo = jackpots[defaultCurrency];

					 for(key in jackpotsInfo) {
						 jackpotValue = jackpotsInfo[key];
						 totalJackpot += jackpotValue / subunits;
					 }

					 totalJackpotFullFormatted = currencyFilter(totalJackpot, currencySymbol);
					 fractionalSymbolIndex = totalJackpotFullFormatted.indexOf(fractionalSymbol);
					 totalJackpotFractional = totalJackpotFullFormatted.substr(fractionalSymbolIndex + 1);
					 totalJackpotFormatted = totalJackpotFullFormatted.substr(0, fractionalSymbolIndex);

					 $scope.totalJackpotIntWithSymbol = totalJackpotFormatted;
					 $scope.fractionalSymbol = fractionalSymbol;
					 $scope.totalJackpotFractional = totalJackpotFractional;
					 $scope.totalJackpotFullFormatted = totalJackpotFullFormatted;
				 });
			 }

			 $rootScope.$watch("user.data.currency", function() {
				updateJackpot();
			 });

			 if(!jackpotIsUpdated) {
				 updateJackpot();
			 }
		 }]
	 };
 }]);
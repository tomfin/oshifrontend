CasinoServices
 .factory('LastPlayedList', ['localStorageService', function (localStorageService) {
	 var last_played_list = localStorageService.get('last_played_ids') || [];

	 return {
		 get_list: function () {
			 return last_played_list;
		 },
		 add: function (identifier) {

			 if (!identifier) return;
			 var gameIndex = last_played_list.indexOf(identifier);
			 if (gameIndex !== -1) {
				 last_played_list.splice(gameIndex, 1);
			 }
			 last_played_list.unshift(identifier);
			 localStorageService.set('last_played_ids', last_played_list);
		 },
		 last_played_list: last_played_list
	 };
 }]);

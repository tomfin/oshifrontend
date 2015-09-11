CasinoServices
 .factory('LastPlayedList', ['localStorageService', function (localStorageService) {
	 var last_played_list = localStorageService.get('last_played') || [];

	 return {
		 get_list: function () {
			 return last_played_list;
		 },
		 add: function (id) {
			 id = parseFloat(id);
			 if (!id) return;
			 var gameIndex = last_played_list.indexOf(id);
			 if (gameIndex !== -1) {
				 last_played_list.splice(gameIndex, 1);
			 }
			 last_played_list.unshift(id);
			 localStorageService.set('last_played', last_played_list);
		 },
		 last_played_list: last_played_list
	 };
 }]);

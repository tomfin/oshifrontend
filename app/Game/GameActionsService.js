CasinoServices
    .factory('GameActions', [function () {
        var gameBoxResize = function (isHd){
                var game_modal = jQuery('.game-modal'),
                    game_container = $('.sga-container'),
                    right_panel_width = $(game_modal).find('.right_panel').width() * 1,
                    bottom_panel_height = $(game_modal).find('.bottom_panel').height() * 1,

                    gameBlock = jQuery("#game-block"),
                    isHdGame = isHd !== undefined ? isHd : jQuery('.sga-container').hasClass('hd-game'),
                    windowWidth = jQuery(window).width(),
                    windowHeight = jQuery(window).height(),
                    fullView = false;

                if (windowWidth < 1000 || windowHeight <= 800 || !FlashDetect.installed) {
                    fullView = true;
                }

                var gW = 4, gH = 3;
                if (isHdGame) {
                    gW = 16; gH = 9;
                }

                var container_height = game_container.height(),
                    container_width = game_container.width(),

                game_block_height = container_height - bottom_panel_height - 2 * 30,
                game_block_width = game_block_height  * gW / gH;

                if (game_block_width + right_panel_width >= container_width * 0.9) {
                    game_block_width = container_width * 0.9 - right_panel_width;
                    game_block_height = game_block_width / gW * gH;
                }

                game_block_width = Math.round(game_block_width / 2) * 2;
                game_block_height = Math.round(game_block_height / 2) * 2;

                if (fullView) {
                	game_block_width = '100%';
                    game_block_height = '100%';
                    document.querySelector('body').classList.add('game-full'); 
                } else {
                	document.querySelector('body').classList.remove('game-full');
                }

                gameBlock.css({
                    width: game_block_width,
                    height: game_block_height
                });
            },
            enableFullScreen = function (el) {
                var docElm = angular.element(jQuery(el))[0];
                if (docElm.requestFullscreen) {
                    docElm.requestFullscreen();
                }
                else if (docElm.msRequestFullscreen) {
                    docElm.msRequestFullscreen();
                }
                else if (docElm.mozRequestFullScreen) {
                    docElm.mozRequestFullScreen();
                }
                else if (docElm.webkitRequestFullScreen) {
                    docElm.webkitRequestFullScreen();
                }
            },
            cancelFullScreen = function (){
                if ($document.exitFullscreen) {
                    $document.exitFullscreen();
                }
                else if ($document.msExitFullscreen) {
                    $document.msExitFullscreen();
                }
                else if ($document.mozCancelFullScreen) {
                    $document.mozCancelFullScreen();
                }
                else if ($document.webkitCancelFullScreen) {
                    $document.webkitCancelFullScreen();
                }
            };


        return {
            gameBoxResize : gameBoxResize,
            enableFullScreen: enableFullScreen,
            cancelFullScreen: cancelFullScreen
        }

    }]);

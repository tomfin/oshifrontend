CasinoDirectives
    .directive('casinoLazySrc', ['$compile', '$timeout', function ($compile, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var loadImage = function () {
                    if (!attr.loading) {
                        if (element[0].getBoundingClientRect().top !== 0 &&
                            element[0].getBoundingClientRect().top < $(window).height() * 1.2) {

                            attr.$set('src', attr.casinoLazySrc);
                            attr.$set('loading', true);
                            element[0].style.opacity = 1;
                        }
                    }
                };
                $timeout(loadImage, 0);

                $(window).scroll(loadImage);
                $(window).resize(loadImage);

                attr.$observe('repeatPosition', function () {
                    loadImage();
                });

                attr.$observe('casinoLazySrc', function () {
                    attr.$set('loading', false);
                    loadImage();
                });
            }

        };
    }]);

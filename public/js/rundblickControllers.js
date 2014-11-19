angular.module('rundblickControllers', []).controller('rundblickController', ['$scope', 'graphAPI', function ($scope, graphAPI) {

    var tz, ty;

    $scope.deg = 0;
    $scope.distance = 100;
    $scope.selected = {};

    /**
     * Loads all facebook pages in the given distance (from scope)
     */
    $scope.loadPages = function () {

        $scope.loading = true;
        $scope.geoError = false;

        graphAPI.getNearestPages($scope.distance).then(
            function (pages) {
                $scope.loading = false;
                $scope.pages = pages;
            },
            function (error) {
                $scope.loading = false;
                if (error.code) {
                    $scope.geoError = true;
                }
            });
    };
    $scope.loadPages();

    /**
     * Selects a page and shows all albums of that page
     * @param page object from loadPages
     */
    $scope.openPage = function (page) {

        $scope.loading = true;
        $scope.albums = null;
        $scope.photos = null;
        $scope.selected.page = page;
        $scope.selected.album = null;
        $scope.selected.photo = null;

        graphAPI.api('/' + page.id + '/albums?fields=id,name')
            .then(function (albums) {
                $scope.loading = false;
                $scope.albums = albums;
            });
    };

    /**
     * Selects an album and shows all photos of that album
     * @param album object from openPage
     */
    $scope.openAlbum = function (album) {

        $scope.photos = null;
        $scope.loading = true;
        $scope.selected.album = album;
        $scope.selected.photo = null;

        graphAPI.api('/' + album.id + '/photos?fields=name,source,likes.limit(0).summary(true)')
            .then(function (photos) {
                $scope.loading = false;
                $scope.photos = photos;
                $scope.tz = Math.round(( 250 / 2 ) / Math.tan(Math.PI / photos.length));
                $scope.ty = 360 / photos.length;
            });
    };

    /**
     * Rotate to previous photo when swiped right
     */
    $scope.swipeRight = function () {
        $scope.deg += $scope.ty;
    };

    /**
     * Rotate to next photo when swiped left
     */
    $scope.swipeLeft = function () {
        $scope.deg -= $scope.ty;
    };

    /**
     * Rotate to the photo at the given index
     * @param index in photo array
     */
    $scope.goTo = function (index) {
        $scope.deg = 360 - (index * $scope.ty);
        $scope.selected.photo = $scope.photos[index];
    }

}]);


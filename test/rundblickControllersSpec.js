describe('rundblickControllers', function () {

    var deferGetNearestPages;
    var $scope, $controller, $q, graphAPI = {};

    beforeEach(function () {

        module('rundblickControllers');
        module(function ($provide) {
            $provide.value('graphAPI', graphAPI);
        });

        inject(function (_$controller_, _$rootScope_, _$q_, _graphAPI_) {
            $q = _$q_;
            $scope = _$rootScope_.$new();
            deferGetNearestPages = $q.defer();
            graphAPI = _graphAPI_;
            graphAPI.getNearestPages = jasmine.createSpy('getNearestPages').andReturn(deferGetNearestPages.promise);
            $controller = _$controller_('rundblickController', {$scope: $scope, graphAPI: graphAPI});
        });
    });

    it('should setup initial values and fetch the nearest pages', function () {

        var pages = [{id: 1}, {id: 2}];

        expect($scope.deg).toEqual(0);
        expect($scope.loading).toBe(true);
        expect($scope.distance).toEqual(100);
        expect($scope.selected).toEqual({});
        expect(graphAPI.getNearestPages).toHaveBeenCalledWith(100);

        deferGetNearestPages.resolve(pages);
        $scope.$digest();
        expect($scope.pages).toEqual(pages);
        expect($scope.loading).toBe(false);
    });

    it('should reset all selections and load albums of a page', function () {

        var page = {};
        var albums = [{}];
        var defer = $q.defer();
        graphAPI.api = jasmine.createSpy('api').andReturn(defer.promise);

        $scope.openPage(page);
        expect(graphAPI.api).toHaveBeenCalled();
        expect($scope.loading).toBe(true);
        expect($scope.albums).toBe(null);
        expect($scope.photos).toBe(null);
        expect($scope.selected.page).toBe(page);
        expect($scope.selected.photo).toBe(null);
        expect($scope.selected.album).toBe(null);

        defer.resolve(albums);
        $scope.$digest();
        expect($scope.loading).toBe(false);
        expect($scope.albums).toBe(albums);
    });

    it('should load all photos of an album and set the selection', function () {

        var page = {};
        var photos = [{}, {}, {}, {}];
        var defer = $q.defer();
        graphAPI.api = jasmine.createSpy('api').andReturn(defer.promise);

        $scope.openAlbum(page);
        expect(graphAPI.api).toHaveBeenCalled();
        expect($scope.photos).toBe(null);
        expect($scope.loading).toBe(true);

        defer.resolve(photos);
        $scope.$digest();
        expect($scope.loading).toBe(false);
        expect($scope.photos).toBe(photos);
        expect($scope.tz).toBe(125);
        expect($scope.ty).toBe(90);
    });

    it('should switch to the previous photo when swiped right', function () {

        $scope.deg = 0;
        $scope.ty = 1;
        $scope.swipeRight();
        expect($scope.deg).toBe(1);
    });

    it('should switch to the next photo when swiped left', function () {

        $scope.deg = 0;
        $scope.ty = 1;
        $scope.swipeLeft();
        expect($scope.deg).toBe(-1);
    });

    it('should rotate to the correct photo at the specified index', function () {

        var photo1 = {id: 1};
        var photo2 = {id: 2};
        $scope.photos = [photo1, photo2];
        $scope.deg = 0;
        $scope.ty = 2;
        $scope.goTo(1);
        expect($scope.deg).toBe(358);
        expect($scope.selected.photo).toBe(photo2);
    });

});

angular.module('rundblickApp', ['graphAPI', 'rundblickControllers', 'ngTouch'])

/**
 * Facebook App Data
 */
    .value('graphAppId', '272035246284448')
    .value('graphScope', 'public_profile')

/**
 * https://docs.angularjs.org/guide/production
 */
    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }]);

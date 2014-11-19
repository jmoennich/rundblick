angular.module('graphAPI', [])

    .factory('graphAPI', ['$q', '$log', 'graphAppId', 'graphScope', function ($q, $log, graphAppId, graphScope) {

        return {

            /**
             *
             * @returns {*}
             */
            init: function () {

                return $q(function (resolve) {

                    if (window.FB) {
                        resolve();
                    }

                    window.fbAsyncInit = function () {
                        FB.init({
                            appId: graphAppId,
                            version: 'v2.1'
                        });
                        $log.debug('FB initialized');
                        resolve();
                    };

                    (function (d, s, id) {
                        var js, fjs = d.getElementsByTagName(s)[0];
                        if (d.getElementById(id)) {
                            return;
                        }
                        js = d.createElement(s);
                        js.id = id;
                        js.src = "//connect.facebook.net/en_US/sdk.js";
                        fjs.parentNode.insertBefore(js, fjs);
                    }(document, 'script', 'facebook-jssdk'));
                });
            },

            /**
             *
             */
            logout: function () {
                FB.logout(function () {
                    $log.debug('Logged out');
                });
            },

            /**
             *
             * @returns {*}
             */
            login: function () {

                if (!window.fbAsyncInit) {
                    return this.init().then(this.login);
                }

                return $q(function (resolve) {
                    FB.getLoginStatus(function (response) {
                        if (response.status === 'connected') {
                            $log.debug('FB already logged in');
                            resolve();

                        } else if (response.error) {
                            $log.error('FB login error');
                            $log.error(error);

                        } else {
                            FB.login(function () {
                                $log.debug('FB logged in');
                                resolve();
                            }, {scope: graphScope});
                        }
                    });
                });
            },

            /**
             *
             * @returns {*}
             */
            api: function (path, method, params) {

                var self = this;

                if (!window.fbAsyncInit) {
                    return this.init()
                        .then(this.login)
                        .then(function () {
                            return self.api(path, method, params);
                        });
                }

                return $q(function (resolve, reject) {
                    FB.api(path, method, params, function (response) {

                        if (!response || response.error) {
                            $log.error('FB error for ' + path);
                            $log.error(response.error);
                            reject(response.error);

                        } else {
                            $log.debug('FB response for ' + path);
                            $log.debug(response.data);
                            resolve(response.data);
                        }
                    });
                });
            },

            /**
             *
             * @param distance
             * @returns {*}
             */
            getNearestPages: function (distance) {

                var self = this;

                return $q(function (resolve, reject) {

                    navigator.geolocation.getCurrentPosition(function (pos) {

                        $log.debug('GEO response');
                        $log.debug(pos);
                        var center = pos.coords.latitude + ',' + pos.coords.longitude;
                        return self.api('/search', 'get', {
                                type: 'place',
                                center: center,
                                distance: distance,
                                fields: 'id,name'
                            }
                        ).then(resolve, reject);

                    }, function (error) {

                        $log.error('GEO error');
                        $log.error(error);
                        reject(error);
                    });
                });
            }
        }

    }]);
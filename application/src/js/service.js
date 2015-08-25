(function(angular) {

    'use strict';

    angular.module('ja.flash-detection').factory('$flash', function($window, $q, $interval, $timeout, $modal, $browser) {

        var settings = {
            name: 'Shockwave Flash',
            type: 'application/x-shockwave-flash',
            swf: 'application/src/swf/load-test.swf',
            modal: {
                keyboard: true,
                backdrop: 'static',
                onClose: angular.noop
            }
        };

        var service = {
            installed: null,
            enabled: null,
            properties: {
                version: null,
                versionStr: null,
                revision: null,
                description: null
            }
        };

        /**
         * Version of flash player
         */
        service.getVersion = function() {
            return this.properties.version;
        };

        /**
         * Revision of flash player
         */
        service.getRevision = function() {
            return this.properties.revision;
        };

        /**
         * Flash player is installed
         * @returns {null}
         */
        service.isInstalled = function() {
            return this.installed;
        };

        /**
         * Flash player is available
         */
        service.isEnabled = function() {
            return this.enabled;
        };

        /**
         * Detect if exist flash player and if is enabled
         * @returns {td.g.promise|*}
         */
        service.detect = function() {

            var deferred = $q.defer(),
                flash = getFlash();

            //If exist
            if (angular.isDefined(flash)) {

                //Get properties
                angular.extend(this, {
                    properties: flash,
                    installed: true
                });

                //Simulates Enabled
                if ($window.swfobject) {

                    this.simulate().then(function() {
                        service.enabled = true;
                        deferred.resolve();
                    }, function() {
                        service.enabled = false;
                        deferred.reject();
                    });

                } else {
                    deferred.resolve();
                }

            } else {
                this.installed = false;
                deferred.reject();
            }

            return deferred.promise;
        };

        /**
         * Make a test of flash player to know if is installed
         * @returns {td.g.promise|*}
         */
        service.simulate = function() {

            var defer = $q.defer();

            //Create a div for apply into swfobject
            var replaceId = 'swfTest' + (Math.random() * 10000);

            var element = angular.element('<div/>', {
                    id: replaceId
                }),
                param = angular.element('<param/>', {
                    name: 'allowscriptacess',
                    value: 'sameDomain'
                });

            element.append(param);

            angular.element('body').append(element);

            $window.swfobject.embedSWF(
                settings.swf,
                replaceId, 1, 1,
                service.properties.versionStr,
                false, false, false, {
                    name: replaceId,
                    allowScriptAccess: 'always'
                },
                function(e) {

                    // flash is installed
                    if (e.ref) {

                        var player = $window.document.getElementById(replaceId),
                            playerStyle = player.style.cssText;

                        //Check is blocked
                        $timeout(function() {

                            //Check if exist property Pan into player
                            var activex = true;
                            //ActiveXObject IE
                            if ($browser.ie()) {
                                activex = 'ActiveXObject' in $window && 'Pan' in new $window.ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                            }

                            if ('Pan' in player && activex) {
                                defer.resolve();
                            }
                            //Check if change style (Plugins of block)
                            else if (player.style.cssText !== playerStyle) {
                                defer.reject();
                            }
                            //Is Blocked
                            else {
                                defer.reject();
                            }

                        }, 2000);
                    }
                    //swfobj was not successful
                    else {
                        defer.reject();
                    }
                }
            );

            return defer.promise;
        };

        //Modal of installing
        service.modalInstall = function() {

            var modalInstall = $modal.open(angular.extend(settings.modal, {
                windowClass: 'flash-install',
                templateUrl: 'application/views/modal/modal-install-flash.html',
                controller: ['$scope', function($scope) {

                    $scope.close = function() {
                        modalInstall.close();
                    };

                }],
                size: 'lg'
            }));

            return modalInstall;
        };

        //Modal of unlock flash player
        service.modalUnlock = function() {

            var modalInstall = $modal.open(angular.extend(settings.modal, {
                windowClass: 'flash-unlock',
                templateUrl: 'application/views/modal/modal-unlock-flash.html',
                controller: ['$scope', '$browser',  function($scope, $browser) {

                    $scope.browserDefault = ($browser.name === 'opera' || $browser.name === 'native') ? true : false;

                    $scope.close = function() {
                        modalInstall.close();
                    };

                }],
                size: 'lg'
            }));

            return modalInstall;
        };

        //Modal of update
        service.modalUpdate = function() {

            var modalUpdate = $modal.open(angular.extend(settings.modal, {
                windowClass: 'flash-update',
                templateUrl: 'application/views/modal/modal-update-flash.html',
                controller: ['$scope', function($scope) {

                    $scope.close = function() {
                        modalUpdate.close();
                    };

                }],
                size: 'lg'
            }));

            return modalUpdate;
        };


        //Verify if is installed and get properties
        function getFlash() {

            if (navigator.plugins && navigator.plugins.length) {
                //Get plugin name
                var flash = navigator.plugins.namedItem(settings.name);

                if (flash) {
                    return getProperties(flash.description);
                }
                //Try get for other way with mimeTypes
                else if (navigator.mimeTypes && navigator.mimeTypes[settings.type]) {
                    var mimeType = navigator.mimeTypes[settings.type];
                    if (mimeType.enabledPlugin && mimeType.enabledPlugin.description) {
                        return getProperties(mimeType.enabledPlugin.description);
                    }
                }
            }
            return undefined;
        }

        // Return object with properties of plugin
        function getProperties(description) {
            var splitDescription = description.split(/ +/);
            return {
                description: description,
                version: parseFloat(splitDescription[2]),
                versionStr: splitDescription[2],
                revision: parseInt(splitDescription[3].replace(/[a-zA-Z]/g, ''), 10)
            };
        }

        return service;

    });

})(angular);
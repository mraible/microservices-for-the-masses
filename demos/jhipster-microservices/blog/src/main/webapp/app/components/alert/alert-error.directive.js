(function() {
    'use strict';

    var jhiAlertError = {
        template: '<div class="alerts" ng-cloak="">' +
                        '<div ng-repeat="alert in $ctrl.alerts" ng-class="[alert.position, {\'toast\': alert.toast}]">' +
                            '<uib-alert ng-cloak="" type="{{alert.type}}" close="alert.close($ctrl.alerts)"><pre>{{ alert.msg }}</pre></uib-alert>' +
                        '</div>' +
                  '</div>',
        controller: jhiAlertErrorController
    };

    angular
        .module('blogApp')
        .component('jhiAlertError', jhiAlertError);

    jhiAlertErrorController.$inject = ['$scope', 'AlertService', '$rootScope', '$translate'];

    function jhiAlertErrorController ($scope, AlertService, $rootScope, $translate) {
        var vm = this;

        vm.alerts = [];

        function addErrorAlert (message, key, data) {
            key = key ? key : message;
            vm.alerts.push(
                AlertService.add(
                    {
                        type: 'danger',
                        msg: key,
                        params: data,
                        timeout: 5000,
                        toast: AlertService.isToast(),
                        scoped: true
                    },
                    vm.alerts
                )
            );
        }

        var cleanHttpErrorListener = $rootScope.$on('blogApp.httpError', function (event, httpResponse) {
            var i;
            event.stopPropagation();
            switch (httpResponse.status) {
            // connection refused, server not reachable
            case 0:
                addErrorAlert('Server not reachable','error.server.not.reachable');
                break;

            case 400:
                var errorHeader = httpResponse.headers('X-blogApp-error');
                var entityKey = httpResponse.headers('X-blogApp-params');
                if (errorHeader) {
                    var entityName = $translate.instant('global.menu.entities.' + entityKey);
                    addErrorAlert(errorHeader, errorHeader, {entityName: entityName});
                } else if (httpResponse.data && httpResponse.data.fieldErrors) {
                    for (i = 0; i < httpResponse.data.fieldErrors.length; i++) {
                        var fieldError = httpResponse.data.fieldErrors[i];
                        // convert 'something[14].other[4].id' to 'something[].other[].id' so translations can be written to it
                        var convertedField = fieldError.field.replace(/\[\d*\]/g, '[]');
                        var fieldName = $translate.instant('blogApp.' + fieldError.objectName + '.' + convertedField);
                        addErrorAlert('Field ' + fieldName + ' cannot be empty', 'error.' + fieldError.message, {fieldName: fieldName});
                    }
                } else if (httpResponse.data && httpResponse.data.message) {
                    addErrorAlert(httpResponse.data.message, httpResponse.data.message, httpResponse.data);
                } else {
                    addErrorAlert(httpResponse.data);
                }
                break;

            case 404:
                addErrorAlert('Not found','error.url.not.found');
                break;

            default:
                if (httpResponse.data && httpResponse.data.message) {
                    addErrorAlert(httpResponse.data.message);
                } else {
                    addErrorAlert(angular.toJson(httpResponse));
                }
            }
        });

        $scope.$on('$destroy', function () {
            if(angular.isDefined(cleanHttpErrorListener) && cleanHttpErrorListener !== null){
                cleanHttpErrorListener();
                vm.alerts = [];
            }
        });
    }
})();

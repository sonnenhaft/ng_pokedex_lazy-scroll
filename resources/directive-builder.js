angular.module('ngMock').factory('directiveBuilder', function ($rootScope, $compile) {
    return {
        build: function (htmlToCompile, scopeParams, controllers) {
            var scope = angular.extend($rootScope.$new(), scopeParams || {});
            var element = angular.element(htmlToCompile);
            if (controllers) {
                angular.forEach(controllers, function (value, key) {
                    element.data('$' + key + 'Controller', value);
                });
            }
            $compile(element)(scope);
            return {scope: scope, element: element};
        },
        $build: function(){
            var result = this.build.apply(this, arguments);
            result.scope.$digest();
            return result;
        }
    };
});

angular.element.prototype.child = function (selector) {
    return angular.element(this[0].querySelector(selector));
};

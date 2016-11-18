(function() {
    'use strict';

    angular
        .module('blogApp')
        .factory('ProductSearch', ProductSearch);

    ProductSearch.$inject = ['$resource'];

    function ProductSearch($resource) {
        var resourceUrl =  'store/' + 'api/_search/products/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();

(function() {
    'use strict';

    angular
        .module('blogApp')
        .factory('EntrySearch', EntrySearch);

    EntrySearch.$inject = ['$resource'];

    function EntrySearch($resource) {
        var resourceUrl =  'api/_search/entries/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();

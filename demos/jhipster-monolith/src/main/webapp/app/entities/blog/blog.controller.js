(function() {
    'use strict';

    angular
        .module('blogApp')
        .controller('BlogController', BlogController);

    BlogController.$inject = ['$scope', '$state', 'Blog', 'BlogSearch'];

    function BlogController ($scope, $state, Blog, BlogSearch) {
        var vm = this;

        vm.blogs = [];
        vm.search = search;
        vm.loadAll = loadAll;

        loadAll();

        function loadAll() {
            Blog.query(function(result) {
                vm.blogs = result;
            });
        }

        function search () {
            if (!vm.searchQuery) {
                return vm.loadAll();
            }
            BlogSearch.query({query: vm.searchQuery}, function(result) {
                vm.blogs = result;
            });
        }    }
})();

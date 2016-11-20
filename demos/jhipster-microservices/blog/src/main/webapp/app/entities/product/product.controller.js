(function() {
    'use strict';

    angular
        .module('blogApp')
        .controller('ProductController', ProductController);

    ProductController.$inject = ['$scope', '$state', 'Product', 'ProductSearch'];

    function ProductController ($scope, $state, Product, ProductSearch) {
        var vm = this;

        vm.products = [];
        vm.search = search;
        vm.loadAll = loadAll;

        loadAll();

        function loadAll() {
            Product.query(function(result) {
                vm.products = result;
            });
        }

        function search () {
            if (!vm.searchQuery) {
                return vm.loadAll();
            }
            ProductSearch.query({query: vm.searchQuery}, function(result) {
                vm.products = result;
            });
        }    }
})();

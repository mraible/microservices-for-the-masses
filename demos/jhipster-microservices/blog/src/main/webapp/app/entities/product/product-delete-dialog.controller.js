(function() {
    'use strict';

    angular
        .module('blogApp')
        .controller('ProductDeleteController',ProductDeleteController);

    ProductDeleteController.$inject = ['$uibModalInstance', 'entity', 'Product'];

    function ProductDeleteController($uibModalInstance, entity, Product) {
        var vm = this;

        vm.product = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Product.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();

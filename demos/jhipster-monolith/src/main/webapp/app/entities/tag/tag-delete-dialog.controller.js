(function() {
    'use strict';

    angular
        .module('blogApp')
        .controller('TagDeleteController',TagDeleteController);

    TagDeleteController.$inject = ['$uibModalInstance', 'entity', 'Tag'];

    function TagDeleteController($uibModalInstance, entity, Tag) {
        var vm = this;

        vm.tag = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Tag.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();

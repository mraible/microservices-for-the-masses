(function() {
    'use strict';

    angular
        .module('blogApp')
        .controller('EntryDeleteController',EntryDeleteController);

    EntryDeleteController.$inject = ['$uibModalInstance', 'entity', 'Entry'];

    function EntryDeleteController($uibModalInstance, entity, Entry) {
        var vm = this;

        vm.entry = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Entry.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();

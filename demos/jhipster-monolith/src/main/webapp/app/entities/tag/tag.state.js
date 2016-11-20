(function() {
    'use strict';

    angular
        .module('blogApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('tag', {
            parent: 'entity',
            url: '/tag',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'blogApp.tag.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/tag/tags.html',
                    controller: 'TagController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('tag');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('tag-detail', {
            parent: 'entity',
            url: '/tag/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'blogApp.tag.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/tag/tag-detail.html',
                    controller: 'TagDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('tag');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Tag', function($stateParams, Tag) {
                    return Tag.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'tag',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('tag-detail.edit', {
            parent: 'tag-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/tag/tag-dialog.html',
                    controller: 'TagDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Tag', function(Tag) {
                            return Tag.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('tag.new', {
            parent: 'tag',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/tag/tag-dialog.html',
                    controller: 'TagDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('tag', null, { reload: 'tag' });
                }, function() {
                    $state.go('tag');
                });
            }]
        })
        .state('tag.edit', {
            parent: 'tag',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/tag/tag-dialog.html',
                    controller: 'TagDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Tag', function(Tag) {
                            return Tag.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('tag', null, { reload: 'tag' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('tag.delete', {
            parent: 'tag',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/tag/tag-delete-dialog.html',
                    controller: 'TagDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Tag', function(Tag) {
                            return Tag.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('tag', null, { reload: 'tag' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();

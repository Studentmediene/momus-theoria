/*
 * Copyright 2016 Studentmediene i Trondheim AS
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

angular.module('theoriApp.directives').
directive('cakes', function($rootScope, $window, $q, MomusService) {
    return {
        restrict: 'E',
        templateUrl:'/partials/templates/cakesTemplate.html',
        link: function (scope, element, attrs) {
            MomusService.getActivePublication().success(function(data){
                scope.activePublication = data;
                $q.all([MomusService.getStatuses(), MomusService.getStatusCounts(scope.activePublication.id)]).then(function(data){
                    scope.statuses = data[0].data;
                    scope.statusCounts = data[1].data;
                    scope.statusLabels = [];
                    scope.statusChartColors = [];

                    for(var i = 0; i < scope.statuses.length; i++){
                        scope.statusLabels.push(scope.statuses[i].name);
                        scope.statusChartColors.push(scope.statuses[i].color);
                    }
                });

                $q.all([MomusService.getReviewStatuses(), MomusService.getReviewStatusCounts(scope.activePublication.id)]).then(function(data){
                    scope.reviewStatuses = data[0].data;
                    scope.reviewStatusCounts = data[1].data;
                    scope.reviewStatusLabels = [];
                    scope.reviewStatusChartColors = [];

                    for(var i = 0; i < scope.reviewStatuses.length; i++){
                        scope.reviewStatusLabels.push(scope.reviewStatuses[i].name);
                        scope.reviewStatusChartColors.push(scope.reviewStatuses[i].color);
                    }
                });

                $q.all([MomusService.getLayoutStatuses(), MomusService.getLayoutStatusCounts(scope.activePublication.id)]).then(function(data){
                    scope.layoutStatuses = data[0].data;
                    scope.layoutStatusCounts = data[1].data;
                    scope.layoutStatusLabels = [];
                    scope.layoutStatusChartColors = [];

                    for(var i = 0; i < scope.layoutStatuses.length; i++){
                        scope.layoutStatusLabels.push(scope.layoutStatuses[i].name);
                        scope.layoutStatusChartColors.push(scope.layoutStatuses[i].color);
                    }
                });
            });
        }
    }
});
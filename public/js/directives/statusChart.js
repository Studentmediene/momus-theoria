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

angular.module('theoriApp.directives')
    .directive('statusChart', function() {
        return {
            restrict: 'E',
            replace:true,
            templateUrl: 'partials/templates/statusChart.html',
            scope: {
                data: '=',
                labels: '=',
                colors: '=',
                statusClick: '&'
            },
            link: function(scope, element, attrs) {
                scope.chartStyle = {cursor: "default"};
                scope.chartOptions = {
                    onClick: function(e,d) {
                        if(d.length > 0){
                            scope.statusClick({selected:d[0]._index});
                        }

                    },
                    hover:{
                        onHover: function(data){
                            if(data.length>0){
                                scope.chartStyle.cursor = "pointer";
                            }else{
                                scope.chartStyle.cursor = "default";
                            }
                            scope.$apply();
                        }
                    }
                };
            }
        };
    });
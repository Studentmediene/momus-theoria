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
                colors: '='
            },
            link: function(scope, element, attrs) {
                scope.chartStyle = {cursor: "default"};
                scope.chartOptions = {
                    events: false,
                    animation: {
                        duration: 0,
                        onComplete: function () {
                            var self = this,
                                chartInstance = this.chart,
                                ctx = chartInstance.ctx;

                            ctx.font = '15px Arial';
                            ctx.textAlign = "center";
                            ctx.fillStyle = "#333";

                            Chart.helpers.each(self.data.datasets.forEach(function (dataset, datasetIndex) {
                                var meta = self.getDatasetMeta(datasetIndex),
                                    total = 0, //total values to compute fraction
                                    labelxy = [],
                                    offset = Math.PI / 2, //start sector from top
                                    radius,
                                    centerx,
                                    centery,
                                    lastend = 0; //prev arc's end line: starting with 0

                                for (var val of dataset.data) { total += val; }

                                Chart.helpers.each(meta.data.forEach( function (element, index) {
                                    radius = 0.9 * element._model.outerRadius - element._model.innerRadius;
                                    centerx = element._model.x;
                                    centery = element._model.y;
                                    var thispart = dataset.data[index],
                                        arcsector = Math.PI * (2 * thispart / total);
                                    if (element.hasValue() && dataset.data[index] > 0 && arcsector > 0.3) {
                                        labelxy.push(lastend + arcsector / 2 + Math.PI + offset);
                                    }
                                    else {
                                        labelxy.push(-1);
                                    }
                                    lastend += arcsector;
                                }), self);

                                var lradius = radius * 3 / 4;
                                for (var idx in labelxy) {
                                    if (labelxy[idx] === -1) continue;
                                    var langle = labelxy[idx],
                                        dx = centerx + lradius * Math.cos(langle),
                                        dy = centery + lradius * Math.sin(langle),
                                        val = Math.round(dataset.data[idx] / total * 100);
                                    if(dataset.data[idx] > 0) {
                                        ctx.fillText(meta.data[idx]._view.label, dx, dy);
                                    }
                                }

                            }), self);
                        }
                    },
                }
            }
        };
    });
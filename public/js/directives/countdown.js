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
    .directive('countdown', function(MomusService, $interval) {
        return {
            restrict: 'E',
            templateUrl: '/partials/templates/countdownTemplate.html',
            link: function(scope, element, attrs) {
                MomusService.getActivePublication().success(function(data){
                    scope.publication = data;
                    var releaseDate = new Date(scope.publication["release_date"]);

                    var formatNumber = function(number) {
                        if (number.toString().length == 1) {
                            return "0" + number.toString();
                        } else {
                            return number.toString();
                        }
                    };
                    var updateCountdown = function() {
                        scope.timeLeft = {};
                        var now = new Date();
                        var seconds = Math.floor((releaseDate - now)/1000);
                        scope.timeLeft.days = formatNumber(Math.floor(seconds/(60*60*24)));
                        seconds = seconds % (60*60*24);
                        scope.timeLeft.hours = formatNumber(Math.floor(seconds/(60*60)));
                        seconds = seconds % (60*60);
                        scope.timeLeft.minutes = formatNumber(Math.floor(seconds/60));
                        scope.timeLeft.seconds = formatNumber(seconds % 60);
                    };
                    $interval(updateCountdown, 1000);
                });

            }
        };
    });
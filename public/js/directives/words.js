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
    .directive('words', function(MomusService, $q, $interval) {
        return {
            restrict: 'E',
            templateUrl: '/partials/templates/wordsTemplate.html',
            link: function(scope, element, attrs) {

                scope.floor = function(num){
                    return Math.floor(num);
                };

                var update = function(){
                    MomusService.getArticlesInActivePublication().success(function(data){
                        scope.articles = data;
                        scope.totalLength = 0;

                        scope.sectionSymbols = {};
                        scope.totalBarLength = 800;

                        var activeRelease = new Date(scope.activePub['release_date']);

                        //Populate section symbol lengths
                        for(var j = 0; j < scope.sections.length;j++){
                            scope.sectionSymbols[scope.sections[j].id] = {
                                section: scope.sections[j],
                                length: 0
                            };
                        }
                        //Find total symbols globally and per section
                        scope.totalLength = 0;
                        for(var i = 0; i < scope.articles.length;i++){
                            scope.totalLength += scope.articles[i].content_length;
                            scope.sectionSymbols[scope.articles[i].section.id].length += scope.articles[i].content_length;
                        }

                        for(var p = 0; p < scope.publications.length;p++){
                            var date = new Date(scope.publications[p]['release_date']);
                            if(date-activeRelease < 0){
                                scope.lastPublication = scope.publications[p];
                                break;
                            }
                        }

                        MomusService.getArticlesInPublication(scope.lastPublication.id).success(function(data){
                            scope.lastSymbolLength = 0;
                            for(var i = 0; i < data.length; i++){
                                scope.lastSymbolLength += data[i]["content_length"];
                            }
                            scope.symbolsLeft = scope.lastSymbolLength-scope.totalLength;
                            scope.hoursLeft = (activeRelease - new Date())/(1000*60*60);
                            scope.symbolsPerHour = Math.ceil(scope.symbolsLeft/scope.hoursLeft);


                        });
                    })
                };
                $q.all([
                    MomusService.getActivePublication(),
                    MomusService.getPublications(),
                    MomusService.getSections()
                ]).then(function(data){
                    scope.activePub = data[0].data;
                    scope.publications = data[1].data;
                    scope.sections = data[2].data;
                    $interval(update, 1000);
                });
            }
        };
    });
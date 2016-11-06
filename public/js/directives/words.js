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

                var activePubReleaseDate;
                scope.sectionSymbols = {};
                scope.totalBarLength = 800;
                scope.totalLength = 0;

                var dictionary = [
                    "spit", "trump", "samfundet", "øl",
                    "ntnu", "bovim", "dusken",
                    "pokemon", "lorem", "ipsum", "usa"
                ];

                // To keep track of how long the app has been running,
                // to see how many symbols have been written the last time span. (caps at 60 minutes)
                var first = true;
                var historicData = [];


                var update = function(){
                    // Get articles and update
                    MomusService.getArticlesInActivePublication().success(function(data){
                        scope.articles = data;

                        //Reset section symbol lengths
                        for(var j = 0; j < scope.sections.length;j++){
                            scope.sectionSymbols[scope.sections[j].id] = {
                                section: scope.sections[j],
                                length: 0
                            };
                        }

                        var lastLength = scope.totalLength;
                        scope.totalLength = 0;

                        scope.word = dictionary[Math.floor(Math.random()*dictionary.length)];
                        scope.wordOccurences = 0;

                        //Find total symbols globally and per section
                        for(var i = 0; i < scope.articles.length;i++){
                            scope.totalLength += scope.articles[i].content_length;
                            scope.sectionSymbols[scope.articles[i].section.id].length += scope.articles[i].content_length;
                            if(!scope.articles[i].rawcontent){
                                continue;
                            }

                            var words = scope.articles[i].rawcontent.split(" ");
                            for(var k = 0; k < words.length; k++) {
                                if (words[k].toLowerCase() == scope.word) {
                                    scope.wordOccurences++;
                                }
                            }
                        }
                        console.log(scope.word + " " + scope.wordOccurences);

                        while(historicData.length >= 120){
                            historicData.shift();
                        }
                        if(!first){
                            historicData.push(scope.totalLength-lastLength);
                        }

                        scope.timeSpan = historicData.length / 2;
                        scope.symbolsAdded = 0;

                        //Find total symbols written the last time span
                        for(var a = 0; a < historicData.length; a++){
                            scope.symbolsAdded += historicData[a];
                        }

                        scope.symbolsLeft = scope.prevTotalLength-scope.totalLength;
                        if(scope.symbolsLeft < 0){
                            scope.symbolsLeft = 0;
                        }
                        scope.hoursLeft = (activePubReleaseDate - new Date())/(1000*60*60);
                        scope.symbolsPerHour = Math.ceil(scope.symbolsLeft/scope.hoursLeft);

                        first = false;
                    })
                };
                $q.all([
                    MomusService.getActivePublication(),
                    MomusService.getLastPublication(),
                    MomusService.getSections()
                ]).then(function(data){
                    scope.activePub = data[0].data;
                    activePubReleaseDate = new Date(scope.activePub['release_date']);
                    scope.prevPub = data[1].data;
                    scope.sections = data[2].data;

                    MomusService.getArticlesInPublication(scope.prevPub.id).success(function(data){
                        scope.prevTotalLength = 0;
                        for(var i = 0; i < data.length; i++){
                            scope.prevTotalLength += data[i]["content_length"];
                        }

                        // Update data every 30 seconds.
                        // More often is not necessary since Momus fetches data from Drive only every minute
                        update();
                        $interval(update, 30000);

                    });
                });
            }
        };
    });
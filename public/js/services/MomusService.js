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

angular.module('theoriApp.services')
    .service('MomusService', function ($http) {
        var momusUrl = "http://10.24.18.119:8080/api/public";
        var username = "test";
        var password = "testesen";
        var headers = {"Authorization": "Basic " + btoa(username + ":" + password)};

        return {
            testConnection: function(){
                return $http.get(momusUrl + "/test", {headers:headers});
            },
            getArticles: function(){
                return $http.get(momusUrl + "/article", {headers:headers});
            },
            getActivePublication: function(){
                return $http.get(momusUrl + "/publication/active", {headers:headers});
            },
            getStatuses: function(){
                return $http.get(momusUrl + "/article/statuses", {headers:headers});
            },
            getReviewStatuses: function(){
                return $http.get(momusUrl + "/article/reviewstatuses", {headers:headers});
            },
            getStatusCounts: function(id){
                return $http.get(momusUrl + "/article/statuscounts/" + id, {headers:headers});
            },
            getReviewStatusCounts: function(id){
                return $http.get(momusUrl + "/article/reviewstatuscounts/" + id, {headers:headers});
            },
            getLayoutStatuses: function(){
                return $http.get(momusUrl + "/publication/layoutstatuses", {headers:headers});
            },
            getLayoutStatusCounts: function(id) {
                return $http.get(momusUrl + "/publication/layoutstatuscounts/" + id, {headers: headers});
            },
            getPublications: function(){
                return $http.get(momusUrl + "/publication", {headers:headers});
            },
            getArticlesInActivePublication: function(){
                return $http.get(momusUrl + "/publication/active/articles", {headers:headers});
            },
            getLastPublication: function(){
                return $http.get(momusUrl + "/publication/previous", {headers:headers});
            },
            getArticlesInPublication: function(id){
                return $http.get(momusUrl + "/publication/" + id + "/articles", {headers:headers});
            },
            getSections: function(){
                return $http.get(momusUrl + "/section", {headers:headers});
            }
        }
    });
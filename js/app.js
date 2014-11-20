"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

angular.module('CommentApp', [])
	.config(function($httpProvider) {
		$httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'GTdqTNtsmhgA7bFUbcF92TMsCZn7SmQq4ZDwi2yg';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'U9vrgbiIKZXxWIEVH4rfUTiC3cbLVOY923bb2zJU';
    })

    .controller('CommentController', function($scope, $http) {
    	//get or refresh all task objects saved by my application on Parse.com
        $scope.refreshComments = function() {
            $scope.loading = true;
            $http.get('https://api.parse.com/1/classes/comments')
                .success(function(responseData) {
                    //when we return a list of data, Parse.com will always
                    //return an object with one property called results
                    //which will can an array with all the data objects
                    $scope.comments = responseData.results;
                    console.log($scope.comments);
                })
                .error(function(err) {
                    console.log(err);
                    //notify user in some way
                })
                .finally(function() {
                    $scope.loading = false;
                });
        }; //scope.refresh comments

        //call the refreshComments() to get the initial set of comments on the page load
        $scope.refreshTasks();

        //initialize a new comment object on the scope for the new comment form
        $scope.newComment = {done: false};

        //function to add a new comment to the list
        $scope.addComment = function(comment) {

            //post will add (insert) a new item to the class
            $http.post('https://api.parse.com/1/classes/comments', comment)
                .success(function(responseData) {
                    //parse.com will return the new objectId in the response data
                    //copy that to the comment we just inserted
                    comment.objectId = responseData.objectId;

                    //add that comment to our comment list
                    $scope.comments.push(comment);

                    //reset the newComment clear the form
                    $scope.newComment = {done: false};
                });
        };

        //function to update an exisiting taks
        $scope.updateComment = function(comment) {
            $scope.updating = true;
            $http.put('https://api.parse.com/1/classes/comments'+ comments.objectId, comment)
                .success(function(responseData) {
                    //don't need to do anything because the local object is already up-to-date
                })
                .error(function(err) {
                    console.log(err);
                    //notify user in some way
                })
                .finally(function() {
                    $scope.updating = false;
                });
        };

    });
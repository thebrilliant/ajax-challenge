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
            console.log("line 16 reached");
            $scope.loading = true;
            $http.get('https://api.parse.com/1/classes/comments')
                .success(function(responseData) {
                    //when we return a list of data, Parse.com will always
                    //return an object with one property called results
                    //which will can an array with all the data objects
                    $scope.comments = responseData.results;
                    console.log("line 24 worked");
                    console.log($scope.comments);
                })
                .error(function(err) {
                    console.log(err);
                    //notify user in some way
                })
                .finally(function() {
                    console.log("finally worked");
                    $scope.loading = false;
                });
        }; //scope.refresh comments


        //call the refreshComments() to get the initial set of comments on the page load
        $scope.refreshComments();

        //initialize a new comment object on the scope for the new comment form
        $scope.comment = {done: false};

        //function to add a new comment to the list
        $scope.addComment = function(comment) {
            console.log("line 43 reached");
            console.log($scope.comment);
            //post will add (insert) a new item to the class
            $http.post('https://api.parse.com/1/classes/comments', $scope.comment)
                .success(function(responseData) {
                    //parse.com will return the new objectId in the response data
                    //copy that to the comment we just inserted
                    $scope.comment.objectId = responseData.objectId;
                    console.log("reached setting comment to response data");

                    //add that comment to our comment list
                    $scope.comments.push($scope.comment);
                    console.log("pushed on the comment");

                    //reset the newComment clear the form
                    $scope.comment = {done: false};
                    console.log("new comment set to active");
                })
                .error(function(err) {
                    console.log(err);
                });
        };

        //function to update an exisiting taks
        $scope.updateComment = function(comment) {
            console.log("line 67 reached");
            $scope.updating = true;
            console.log("comment:");
            console.log(comment);
            $http.put('https://api.parse.com/1/classes/comments'+ $scope.comment.objectId, comment)
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

        $scope.removeComment = function(comment) {
            console.log("comment");
            console.log(comment);

            $http.delete('https://api.parse.com/1/classes/comments'+ $scope.comment.objectId, comment)
                .success(function() {
                    console.log("comment deleted");
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    console.log("ran removeComment function");
                });
        };

    });
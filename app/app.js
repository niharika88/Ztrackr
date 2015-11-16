'use strict';

var QuestionAnsApp = angular.module('QuestionAnsApp', ['firebase'] );
QuestionAnsApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/questions', {
      templateUrl: 'partials/question-list.html',
      controller: 'QuestionList'
    }).
    when('/questions/new', {
      templateUrl: 'partials/question-form.html',
      controller: 'QuestionNew'
    }).
    when('/questions/:questionId', {
  templateUrl: 'partials/question-form.html',
  controller: 'QuestionDetail'
}).
    otherwise({
      redirectTo: '/questions'
    });
}]);

QuestionAnsApp.controller('QuestionList', ['$scope', '$firebase', function($scope, $firebase) {
  var firebaseUrl = "https://vivid-heat-7872.firebaseio.com/questions";
  $scope.questions = $firebase(new Firebase(firebaseUrl));
  $scope.deleteQuestion = function(questionId) {
  $scope.questions.$remove(questionId);
}
$scope.answerQuestion = function(question, selectedAnswer) {
  question.answered = true;
  question.correct = (question.answer === selectedAnswer);
};
}]);

QuestionAnsApp.controller('QuestionNew', ['$scope', '$firebase', '$location', function($scope, $firebase, $location) {
  $scope.question = {};

  $scope.persistQuestion = function(question) {
    var firebaseUrl = "https://vivid-heat-7872.firebaseio.com/questions";
    $scope.questions = $firebase(new Firebase(firebaseUrl));
    $scope.questions.$add(question).then(function(ref) {
  $location.url('/questions');
    });
  };
}]);

QuestionAnsApp.controller('QuestionDetail', ['$scope', '$firebase', '$routeParams', function($scope, $firebase, $routeParams) {
  var firebaseUrl = "https://vivid-heat-7872.firebaseio.com/questions/" + $routeParams.questionId;
  $scope.question = $firebase(new Firebase(firebaseUrl));
  $scope.persistQuestion = function(question) {
    $scope.question.$update({
      question: question.question,
      option1: question.option1,
      option2: question.option2,
      option3: question.option3,
      answer: question.answer
    }).then(function(ref) {
      $location.url('/questions');
    });
  };
}]);


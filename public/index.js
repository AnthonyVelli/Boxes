'use strict';

var fromScratch = angular.module('fromScratch', ['ui.router']);

fromScratch.directive('avInput', function(){
	return {
		restrict: 'E',
		templateUrl: './directives/input.html',
	};
});

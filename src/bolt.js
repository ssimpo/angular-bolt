angular.module("bolt").factory("$bolt", [
	"$timeout",
function($timeout) {
	"use strict";

	function shallowCopy(obj) {
		var args = Array.prototype.slice.call(arguments);
		args.unshift({});
		var copy = Object.assign.apply(Object, args);

		angular.forEach(copy, function(value, key) {
			if (value === undefined) {
				delete copy[key];
			}
		});

		return copy;
	}

	function apply(options){
		var controller = options.controller || options.scope[options.scopeName];
		$timeout(function(){
			options.scope.$apply(function(){
				controller[options.attributeName] = options.value;
			});
		});
	}

	function chunk(ary, chunkSize) {
		return ary.map(function(item, index){
			return index % chunkSize === 0 ? ary.slice(index, index + chunkSize) : null;
		}).filter(function(item){
			return item;
		});
	}

	function shuffle(ary) {
		var currentIndex = ary.length, temporaryValue, randomIndex;

		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = ary[currentIndex];
			ary[currentIndex] = ary[randomIndex];
			ary[randomIndex] = temporaryValue;
		}

		return ary;
	}

	return {
		"apply": apply,
		"chunk": chunk,
		"shallowCopy": shallowCopy,
		"shuffle": shuffle
	};
}]);
angular.module("bolt").factory("$bolt", [
	"$timeout",
	function($timeout) {
		"use strict";

		function shallowCopy(...args) {
			args.unshift({});
			const copy = Object.assign.apply(Object, args);

			angular.forEach(copy, (value, key) => {
				if (value === undefined) {
					delete copy[key];
				}
			});

			return copy;
		}

		function apply(options){
			if (options.value.then) {
				options.value.then(function(value) {
					options.value = value;
					apply(options);
				});
			} else {
				const controller = options.controller || options.scope[options.scopeName];

				$timeout(function(){
					options.scope.$apply(function(){
						controller[options.attributeName] = options.value;
						if (options.callback) {
							options.callback(options.value);
						}
					});
				});
			}
		}

		/**
		 * @todo Does this work? .fill() being used!
		 */
		function fill(start, end) {
			return Array(end - start + 1).fill().map((i, n) => start + n);
		}

		function chunk(ary, chunkSize) {
			return ary.map((item, index) =>
				index % chunkSize === 0 ? ary.slice(index, index + chunkSize) : null
			).filter(item => item);
		}

		function shuffle(ary) {
			let currentIndex = ary.length, temporaryValue, randomIndex;

			while (0 !== currentIndex) {
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;
				temporaryValue = ary[currentIndex];
				ary[currentIndex] = ary[randomIndex];
				ary[randomIndex] = temporaryValue;
			}

			return ary;
		}

		function forN(N) {
			return Array.apply(null, {length: N}).map(Number.call, Number);
		}

		return {
			apply, chunk, fill, forN, shallowCopy, shuffle
		};
	}]);
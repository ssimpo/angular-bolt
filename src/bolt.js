angular.module("bolt").factory("$bolt", [
	"$timeout",
	"$q",

function($timeout, $q) {
	"use strict";

	/**
	 * @description
	 * Given any value, ensure is an array. Arrays are just returned;
	 * whilst, other objects are returned with themselves as the first
	 * item in an array. Unde
	 * @param value
	 * @returns {*}
	 */
	function makeArray(value) {
		return (angular.isArray(value) ? value : ((value !== undefined) ? [value] : []));
	}

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

	function copy(obj, keys) {
		let copied = {};
		(Array.isArray(keys)?keys:Object.keys(keys)).forEach(key => {
			copied[key] = obj[key];
		});
		return copied;
	}

	function apply(options){
		if (options.value && options.value.then) {
			options.value.then(function(value) {
				options.value = value;
				apply(options);
			});
		} else {
			if (options.scope && !options.controller) options.controller = get(options.scope);
			if (!options.scope && options.controller && options.controller.parent) options.scope = options.controller.parent;

			const controller = options.controller || options.scope[options.scopeName];
			const scope = options.scope;

			return $q(resolve => {
				$timeout(() => {
					scope.$apply(() => {
						if (!options.attributeName && isObject(options.value)) {
							Object.assign(controller, options.value);
						} else {
							controller[options.attributeName] = options.value;
						}

						resolve(options.value);
						if (options.callback) {
							options.callback(options.value, options.controller);
						}
					});
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

	function forOwn(obj, iterator) {
		Object.keys(obj).forEach(key => iterator(obj[key], key));
	}

	function forOwnMap(obj, iterator) {
		let mapped = {};
		Object.keys(obj).forEach(key => {
			Object.assign(mapped, iterator(obj[key], key));
		});
		return mapped;
	}

	function forOwnFilter(obj, iterator) {
		let filtered = Object.assign({}, obj);
		Object.keys(obj).forEach(key => {
			if (!iterator(obj[key], key)) {
				delete  filtered[key];
			}
		});
		return filtered;
	}

	function forOwnMapArray(obj, iterator) {
		return Object.keys(obj).map(key => iterator(obj[key], key));
	}

	function forOwnFilterArray(obj, iterator) {
		return Object.values(forOwnFilter(obj, iterator))
	}

	/**
	 * @description
	 * Test if a value is a plain object (ie. an object but not an array
	 * or null).
	 *
	 * @param {*} value 		Value to test.
	 * @returns {boolean}		Result of test.
	 */
	function isObject(value) {
		return (angular.isObject(value) && !angular.isArray(value));
	}

	return {
		apply, chunk, fill, forN, shallowCopy, shuffle, forOwn, forOwnMap,
		forOwnMapArray, forOwnFilter, forOwnFilterArray, makeArray, isObject,
		copy
	};
}]);
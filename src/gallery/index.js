angular.module("big-gallery").directive("bigGallery", [
	"$window",
	"$http",
	"$timeout",

	function ($window, $http, $timeout){
		"use strict";

		var scopeName = "gallery";
		var observeAttributes = ["src", "nonce", "action"];

		function init(scope, element, attributes) {
			initObservers(attributes, scope);
			initWatchers(scope);
		}

		function initObservers(attributes, scope) {
			angular.forEach(observeAttributes, function(attributeName) {
				copyAttributeValueToController(attributeName, attributes, scope);
			});
		}

		function initWatchers(scope) {
			var controller = scope[scopeName];

			scope.$watch(function(){
				var watchers = {};

				angular.forEach(observeAttributes, function(attributeName) {
					watchers[attributeName] = controller[attributeName];
				});

				return watchers;
			}, function(watchers) {
				((watchers.action) ? getWordpressJson(controller) : getJson(controller)).then(function(data) {
					applyData(scope, parseData(data));
				});
			}, true);
		}

		function getJson(controller) {
			return $http.get(controller.src, {}).then(function (response) {
				if (response && response.data) {
					return response.data;
				}
				throw "Incorrect data returned";
			});
		}

		function getWordpressJson(controller) {
			return $http({
				method: "post",
				url: controller.src,
				data: {
					action: controller.action,
					nonce: controller.nonce
				},
				transformRequest: function(obj) {
					var str = [];
					for(var p in obj)
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					return str.join("&");
				}
			}).then(function (response) {
				if (response && response.data) {
					return response.data;
				}
				throw "Incorrect data returned";
			});
		}

		function parseData(data){
			return data;
		}

		function applyData(scope, data){
			$timeout(function(){
				scope.$apply(function(){
					scope[scopeName].data = data;
				});
			});
		}

		function copyAttributeValueToController(attributeName, attributes, scope) {
			var controller = scope[scopeName];

			observe(attributes, attributeName, function (value){
				try {
					controller[attributeName] = scope.$eval(value, $window);
					if ((value !== undefined) && (controller[attributeName] === undefined)) {
						controller[attributeName] = value;
					}
				} catch (error) {
					controller[attributeName] = value;
				}
			});
		}

		/**
		 * @decription
		 * Observe an attribute value and trigger a callback when the
		 * value changes.
		 *
		 * @param {Array} iAttrs			The directive attributes array.
		 * @param {string} attributeName 	The attribute name to observe.
		 * @param {function} callback		Callback to fire.
		 */
		function observe(iAttrs, attributeName, callback){
			iAttrs.$observe(attributeName, function (value, oldValue){
				if(value !== oldValue){
					callback(value, oldValue);
				}
			});
		}

		function controller(){
			var vm = this; // jshint ignore:line

			vm.current = 0;

			vm.next = function() {
				if (vm.data && vm.data.length) {
					vm.current++;
					vm.current = ((vm.current >= vm.data.length) ? 0 : vm.current);
				}
			}
		}


		return {
			restrict: "EA",
			templateUrl: "src/menu/index.html",
			controllerAs: scopeName,
			scope: true,

			controller: [controller],

			link: function (scope, iElement, iAttrs) {
				init(scope, iElement, iAttrs);
			}
		};
	}
]);

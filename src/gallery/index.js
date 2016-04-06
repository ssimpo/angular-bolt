angular.module("big-gallery").directive("bigGallery", [
	"boltAjax",
	"$bolt",
	"boltObserver",
	"boltWatcher",
	"$timeout",

	function ($ajax, $bolt, $observe, $watcher, $timeout){
		"use strict";

		var scopeName = "gallery";
		var observeAttributes = ["src", "nonce", "action"];

		function init(scope, element, attributes) {
			var options = {
				attributes: attributes,
				scope: scope,
				scopeName: scopeName,
				toObserve: observeAttributes
			};

			$observe.reflect(options);
			$watcher.report($bolt.shallowCopy(options, {
				callback: watchTrigger
			}));
		}

		function watchTrigger(watchers, options) {
			(
				(watchers.action) ?
					$ajax.getWordpress(scope[scopeName]) :
					$ajax.get(options.scope[scopeName])
			).then(function (data) {
				$bolt.apply({
					scope: options.scope,
					attributeName: "data",
					value: parseData(data),
					scopeName: scopeName
				});
			});
		}

		function parseData(data){
			return data;
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
			templateUrl: "src/gallery/index.html",
			controllerAs: scopeName,
			scope: true,

			controller: [controller],

			link: function (scope, iElement, iAttrs) {
				init(scope, iElement, iAttrs);
			}
		};
	}
]);

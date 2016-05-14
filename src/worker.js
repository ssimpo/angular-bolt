angular.module("bolt").factory("$worker", [
	"$worker.messenger",
	"$q",
	"$rootScope",
function(messenger, $q, $rootScope) {
	"use strict";

	function getFunctionContent(func) {
		var funcString = func.toString();
		return funcString.slice(funcString.indexOf("{") + 1, funcString.lastIndexOf("}"));
	}

	function blobUrlForContent(content) {
		return window.URL.createObjectURL(new Blob([content]));
	}

	function getFunctionContentUrl(func) {
		var content = getFunctionContent(func) + getFunctionContent(messenger);
		return blobUrlForContent(content);
	}

	function createWorkerScope(worker) {
		var scope = $rootScope.$new(true);
		return createMessageToScopeRelay(worker, scope);
	}

	function createMessageToScopeRelay(worker, scope) {
		angular.element(worker).on("message", function(message) {
			var type = message.originalEvent.data.type;
			var data = message.originalEvent.data.data;
			data = (angular.isString(data) ? JSON.parse(data) : data);
			scope.$emit(type, data);
		});
		return scope;
	}

	function createWorkerPromise(scope) {
		return $q(function(resolve, reject) {
			var unregister = scope.$on("ready", function() {
				unregister();
				resolve(scope);
			});
		});
	}

	function load(func) {
		return createWorkerPromise(
			createWorkerScope(
				new Worker(getFunctionContentUrl(func))
			)
		);
	}

	return {
		load: load
	};
}]);
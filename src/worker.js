angular.module("bolt").factory("$worker", [
	"$worker.messenger",
	"$q",
	"$rootScope",
function(messenger, $q, $rootScope) {
	"use strict";

	var __sendStrings = __canSendJson();
	var scopes = {};

	function __canSendJson() {
		var onlyStrings = false;

		try {
			window.postMessage({
				toString: function() {
					onlyStrings = true;
				}
			},"*");
		} catch(e) { }

		return onlyStrings;
	}

	function getFunctionContent(func) {
		var funcString = func.toString();
		return funcString.slice(funcString.indexOf("{") + 1, funcString.lastIndexOf("}"));
	}

	function blobUrlForContent(content) {
		return window.URL.createObjectURL(new Blob([content]));
	}

	function getFunctionContentUrl(func) {
		var content = getFunctionContent(messenger) + getFunctionContent(func);
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

		scope.$broadcast = function(type, data, transferable) {
			var message = {
				type: type,
				data: data || {}
			};

			worker.postMessage(__sendStrings ? JSON.stringify(message) : message, transferable);
		};

		return scope;
	}

	function createWorkerPromise(scope) {
		return $q(function(resolve, reject) {
			var unregister = scope.$on("ready", function() {
				unregister();
				//scopes[name] = scopes[name] || [];
				//scopes[name].push(scope);
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
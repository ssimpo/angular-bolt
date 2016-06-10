angular.module("bolt").factory("$worker", [
	"$worker.messenger",
	"$q",
(messenger, $q) => {
	"use strict";

	const __sendStrings = __canSendJson();
	const scopes = {};

	function __canSendJson() {
		let onlyStrings = false;

		try {
			window.postMessage({
				toString: () => {
					onlyStrings = true;
				}
			},"*");
		} catch(e) { }

		return onlyStrings;
	}

	function getFunctionContent(func) {
		const funcString = func.toString();
		return funcString.slice(funcString.indexOf("{") + 1, funcString.lastIndexOf("}"));
	}

	function blobUrlForContent(content) {
		return window.URL.createObjectURL(new Blob([content]));
	}

	function getFunctionContentUrl(func) {
		return blobUrlForContent(
			getFunctionContent(messenger) + getFunctionContent(func)
		);
	}

	function createWorkerScope(worker) {
		return createMessageToScopeRelay(worker, rootScope.$new(true));
	}

	function createMessageToScopeRelay(worker, scope) {
		angular.element(worker).on("message", message => {
			const type = message.originalEvent.data.type;
			let data = message.originalEvent.data.data;
			data = (angular.isString(data) ? JSON.parse(data) : data);
			scope.$emit(type, data);
		});

		scope.$broadcast = (type, data = {}, transferable) => {
			const message = {type, data};
			worker.postMessage(__sendStrings ? JSON.stringify(message) : message, transferable);
		};

		return scope;
	}

	function createWorkerPromise(scope) {
		return $q(resolve => {
			let unregister = scope.$on("ready", function() {
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
angular.module("bolt").factory("$worker.messenger", [function() {
	"use strict";

	return function() {
		const __sendStrings = __canSendJson();
		const __messageListeners = {};

		function __canSendJson() {
			let onlyStrings = false;

			try {
				self.postMessage({
					toString: function(){
						onlyStrings=true;
					}
				});
			} catch(e){ }

			return onlyStrings;
		}

		function sendMessage(type, data = {}, transferable) {
			let message = {type, data};
			self.postMessage(__sendStrings ? JSON.stringify(message) : message, transferable);
		}

		function registerForMessage(type, callback) {
			__messageListeners[type] = __messageListeners[type] || [];
			__messageListeners[type].push(callback);
		}

		self.addEventListener('message', function(message) {
			message.data = (__sendStrings ? JSON.parse(message.data) : message.data);
			if (__messageListeners[message.data.type]) {
				__messageListeners[message.data.type].forEach(callback =>
					callback(message.data.data)
				);
			}
		});

		sendMessage("ready");
	}
}]);
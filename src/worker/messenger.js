angular.module("bolt").factory("$worker.messenger", [function() {
	"use strict";

	return function() {
		var __sendStrings = __canSendJson();
		var __messageListeners = {};

		function __canSendJson() {
			var onlyStrings = false;

			try {
				self.postMessage({
					toString: function(){
						onlyStrings=true;
					}
				});
			} catch(e){ }

			return onlyStrings;
		}

		function sendMessage(type, data, transferable) {
			var message = {
				type: type,
				data: data || {}
			};

			self.postMessage(__sendStrings ? JSON.stringify(message) : message, transferable);
		}

		function registerForMessage(type, callback) {
			__messageListeners[type] = __messageListeners[type] || [];
			__messageListeners[type].push(callback);
		}

		self.addEventListener('message', function(message) {
			message.data = (__sendStrings ? JSON.parse(message.data) : message.data);
			if (__messageListeners[message.data.type]) {
				__messageListeners[message.data.type].forEach(function(callback) {
					callback(message.data.data);
				});
			}
		});

		sendMessage("ready");
	}
}]);
angular.module("bolt").factory("$worker.messenger", [function() {
	"use strict";

	return function() {
		var sendStrings = canSendJson();

		function canSendJson() {
			var onlyStrings = false;

			try {
				window.postMessage({
					toString: function(){
						onlyStrings=true;
					}
				});
			} catch(e){ }

			return onlyStrings;
		}

		function sendMessage(type, data) {
			var message = {
				type: type,
				data: data || {}
			};

			self.postMessage(sendStrings ? JSON.stringify(message) : message);
		}

		sendMessage("ready");
	}
}]);
angular.module("bolt").factory("boltAjax", [
	"$http",
function($http) {
	"use strict";

	function get(options) {
		return $http.get(options.src, {}).then(function (response) {
			if (response && response.data) {
				return response.data;
			}
			throw options.incorrectDataError || "Incorrect data returned";
		});
	}

	function getWordpress(options) {
		return $http({
			method: "post",
			url: options.src,
			data: getPostOptions(options),
			transformRequest: encodePostRequest
		}).then(function (response) {
			if (response && response.data) {
				return response.data;
			}
			throw options.incorrectDataError || "Incorrect data returned";
		});
	}

	function getPostOptions(config) {
		var post = {
			action: config.action
		};

		if (config.nonce) {
			post.nonce = config.nonce;
		}

		return post;
	}

	function encodePostRequest(obj) {
		var str = [];

		angular.forEach(obj, function(value, key) {
			str.push(getEncodedPostPart(key, value));
		});

		return str.join("&");
	}

	function getEncodedPostPart(key, value) {
		return encodeURIComponent(key) +
			((value !== undefined)? "=" + encodeURIComponent(value) : "");
	}

	return {
		"get": get,
		"getWordpress": getWordpress
	};
}]);
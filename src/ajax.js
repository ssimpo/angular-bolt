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

	function getWordpress(options, moreOptions) {
		return $http({
			method: "post",
			url: options.src,
			data: getPostOptions(options, moreOptions),
			transformRequest: encodePostRequest
		}).then(function (response) {
			if (response && response.data) {
				return response.data;
			}
			throw options.incorrectDataError || "Incorrect data returned";
		});
	}

	function getPostOptions(config, moreOptions) {
		var post = Object.assign({}, moreOptions, {
			action: config.action
		});

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
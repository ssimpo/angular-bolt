angular.module("bolt").factory("boltAjax", [
	"$http",
	"$window",
function($http, $window) {
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
		var post = getPostOptions(options, moreOptions);
		return $http({
			method: "post",
			url: options.src,
			data: post,
			transformRequest: encodePostRequest
		}).then(function (response) {
			var root = options.root || moreOptions.root;
			if (response && response.data) {
				if (response.data.nonce && root && post.action) {
					var nonce = root.attr('nonce');
					if (nonce && $window[nonce]) {
						nonce = $window[nonce];
						if (nonce.nonce && nonce.nonce[post.action]) {
							nonce.nonce[post.action] = response.data.nonce;
						}
					}
				}

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
			if (angular.isString(config.nonce.nonce)) {
				post.nonce = config.nonce.nonce;
			} else if (config.nonce.nonce[config.action]) {
				post.nonce = config.nonce.nonce[config.action];
			}
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
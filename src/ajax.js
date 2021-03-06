angular.module("bolt").factory("boltAjax", [
	"$bolt",
	"$http",
	"$window",
($bolt, $http, $window) => {
	"use strict";

	let timeout = 20;

	function get(options) {
		return $http.get(options.src, {}).then(response => {
			if (response && response.data) {
				return response.data;
			}
			throw options.incorrectDataError || "Incorrect data returned";
		});
	}

	function post(options) {
		if ($window.socketConnected) {
			return new Promise((resolve, reject)=>{
				let timeoutRef = setTimeout(()=>{
					clearTimeout(timeoutRef);
					reject({
						type: 'application/json',
						status: 0,
						path: options.src,
						body: "Timeout"
					});
				}, 1000*timeout);

				$window.socket.emit("post", {
					path: options.src,
					body: options.data || {},
					messageId:  $bolt.randomString()
				}, response=>{
					if (timeoutRef) {
						clearTimeout(timeoutRef);
						if ((response.status && (response.status < 400))) return resolve(response.body);
						reject(response);
					}
				});
			});
		} else {
			return $http.post(options.src, options.data || {}).then(response=>{
				if (response && response.data) {
					return response.data;
				}
				throw options.incorrectDataError || "Incorrect data returned";
			});
		}
	}

	function getWordpressPage(options) {
		let url = angular.element("[rel='https://api.w.org/']").attr("href") + "wp/v2/pages";
		let slug = options.src;

		return $http({method: "get", url, params: {slug}}).then(res=>{
			if (res && res.data && res.data.length) return {
				title: res.data[0].title.rendered,
				content: res.data[0].content.rendered
			};
			console.error(res.data);
			throw options.incorrectDataError || "Incorrect data returned";
		});
	}

	function getWordpress(options, moreOptions) {
		const post = getPostOptions(options, moreOptions);

		return $http({
			method: "post",
			url: options.src,
			data: post,
			transformRequest: encodePostRequest
		}).then(response => {
			let root = options.root || moreOptions.root;
			if (response && response.data) {
				if (response.data.nonce && root && post.action) {
					let nonce = root.attr('nonce');
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
		const post = Object.assign({}, moreOptions, {
			action: config.action
		});

		if (config.nonce) {
			if (config.nonce.nonce) {
				if (angular.isString(config.nonce.nonce)) {
					post.nonce = config.nonce.nonce;
				} else if (config.nonce.nonce[config.action]) {
					post.nonce = config.nonce.nonce[config.action];
				}
			} else {
				post.nonce = config.nonce;
			}
		}

		return post;
	}

	function encodePostRequest(obj) {
		const str = [];
		angular.forEach(obj, (value, key) => str.push(getEncodedPostPart(key, value)));
		return str.join("&");
	}

	function getEncodedPostPart(key, value) {
		return encodeURIComponent(key) +
			((value !== undefined)? "=" + encodeURIComponent(value) : "");
	}

	return {
		get, getWordpress, post, timeout, getWordpressPage
	};
}]);
angular.module("bolt").factory("boltDirective", [
	"$bolt",
	"boltObserver",
	"boltWatcher",
function($bolt, $observe, $watcher) {
	"use strict";

	const directives = new WeakMap();

	function link(scope, root, controller) {
		controller.parent = scope;
		controller.root = root;

		if (!directives.has(root)) directives.set(root, []);
		let controllers = directives.get(root);
		controllers.push(controller);
	}

	/**
	 * Observe supplied attributes and reflect these to the controller
	 * firing a watch function when they change.
	 *
	 * @private
	 * @param {Object} options		Options to pass to $observe.reflect()
	 * 								and $watchers.report().
	 */
	function observeWatch(options, watchTrigger) {
		$observe.reflect(options);
		options.controller.reload = $watcher.report(
			$bolt.shallowCopy(options, {callback: watchTrigger})
		).trigger;
	}

	function get(root) {
		return directives.get(root);
	}

	return {
		link, get, observeWatch
	};
}]);
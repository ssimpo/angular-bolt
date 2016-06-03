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

		let node = root;
		if (node.length) node = node[0];

		pushController(node, controller);
		pushController(scope, controller);
	}

	function pushController(ref, controller) {
		if (!directives.has(ref)) directives.set(ref, []);
		let controllers = directives.get(ref);
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
		if (options.scope && !options.controller) options.controller = get(options.scope);
		if (!options.scope && options.controller && options.controller.parent) options.scope = options.controller.parent;

		$observe.reflect(options);
		options.controller.reload = $watcher.report(
			$bolt.shallowCopy(options, {callback: watchTrigger})
		).trigger;
	}

	function get(ref) {
		let controllers = directives.get(ref);
		return ((controllers.length === 1) ? controllers[0] : controllers);
	}

	return {
		link, get, observeWatch
	};
}]);
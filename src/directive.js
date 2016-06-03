angular.module("bolt").factory("boltDirective", [
	"$bolt",
	"boltObserver",
	"boltWatcher",
	"$q",

function($bolt, $observe, $watcher, $q) {
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

	function set(ref, propName, propValue) {
		return $q.all($bolt.makeArray(get(ref)).map(
			controller => _set(controller, propName, propValue)
		)).then(data => {
			return ((data.length === 1) ? data[0] : data);
		});
	}

	function _set(controller, attributeName, value) {
		console.log(controller, attributeName, value);
		return $bolt.apply({controller, attributeName, value});
	}

	return {
		link, get, set, observeWatch
	};
}]);
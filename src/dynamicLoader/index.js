angular.module("bolt").directive("dynamicLoader", [
	"$bolt",
	"boltDirective",
	"boltAjax",
	"$location",
	"$compile",
($bolt, $directive, $ajax, $location, $compile) => {
	"use strict";

	const controllerAs = "loader";

	/**
	 * @description
	 * Setup all the observations and watches in the new directive.
	 *
	 * @private
	 * @param {Object} scope		The directive scope.
	 * @param {Object} root			The directive root element.
	 * @param {Array} attributes	Attributes attached to the directive
	 * 								root element.
	 * @param {Object} controller	The controller instance for this directive.
	 */
	function link(scope, root, attributes, controller) {
		$directive.link({scope, root, controller});
		$directive.reportEvaluate(controller, ["src", "action", "nonce"]);
		scope.$watch(()=>$location.path(), ()=>onSrcChange({}, controller));
	}

	function onSrcChange(watched, controller = this) {
		if (controller.src && (controller.src !== "")) {
			if (controller.first) {
				const ajaxMethod = $ajax[controller.action ? "getWordpress" : "get"];
				ajaxMethod(controller, {"path":$location.path()})
					.then(data => applyPage(data, controller))
			} else {
				controller.first = false;
			}
		}
	}

	function applyPage(page, controller) {
		if (controller.current) controller.current.$destroy();
		$directive.destroyChildren(controller.root);
		controller.root.empty();
		controller.root.html(page);
		controller.current = controller.parent.$new();
		$compile(controller.root.contents())(controller.current);
	}

	function getController(ref) {
		if (ref) return $directive.get(ref);
		let controller = this;

		Object.assign(controller, {
			first: true
		});
	}

	return {
		restrict: "A",
		controllerAs,
		scope: true,
		controller: [getController],
		bindToController: {
			_src: "@dynamicLoader",
			_nonce: "@?nonce",
			_action: "@?action",
		},
		link
	};
}])
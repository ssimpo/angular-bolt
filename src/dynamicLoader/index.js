angular.module("bolt").directive("dynamicLoader", [
	"$document",
	"$bolt",
	"boltDirective",
	"boltAjax",
	"$location",
	"$compile",
($doc, $bolt, $directive, $ajax, $location, $compile) => {
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
		let baseNode = $doc.find("head base");
		if (baseNode.length) controller.baseNode = angular.element(baseNode[0]);
		baseNode = undefined;

		$directive.reportEvaluate(controller, ["src", "action", "nonce"]);
		scope.$watch(()=>$location.path(), ()=>onSrcChange({}, controller));
	}

	function onSrcChange(watched, controller=this) {
		if (controller.src && (controller.src !== "")) {
			if (controller.first) {
				const ajaxMethod = $ajax[controller.action ? "getWordpress" : ((controller.src === "wordpressApi") ? "getWordpressApi" : "post")];

				if (!controller.action) {
					ajaxMethod({src: $location.path()}).then(data=>applyPage(data, controller));
				} else {
					ajaxMethod(controller, {
						"path":$location.path(),
						"base":controller.baseNode?controller.baseNode.attr("href"):"/"
					}).then(data=>applyPage(data, controller));
				}
			} else {
				controller.first = false;
			}
		}
	}

	function applyPage(page, controller) {
		if (controller.current) controller.current.$destroy();
		$directive.destroyChildren(controller.root);
		controller.root.empty();
		controller.root.html(page.content || page);
		controller.current = controller.parent.$new();

		if (controller.parent.app && controller.id && (controller.id.toString().trim() !== "")) {
			controller.parent.app[controller.id.toString().trim()] = page;
		}

		$compile(controller.root.contents())(controller.current);
	}

	function dynamicLoadController() {
		let controller = this;
		controller._name = "dynamicLoadController";

		Object.assign(controller, {
			first: true
		});
	}

	return {
		restrict: "A",
		controllerAs,
		scope: true,
		controller: [dynamicLoadController],
		bindToController: {
			_src: "@dynamicLoader",
			_nonce: "@?nonce",
			_action: "@?action",
			id: "@"
		},
		link
	};
}]).config(["$locationProvider", ($locationProvider) => {
	"use strict";

	$locationProvider.html5Mode({
		enabled: true,
		rewriteLinks: true
	});
}]);

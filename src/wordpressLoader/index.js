angular.module("bolt").directive("wordpressLoader", [
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
		controller.path = $location.path();
		scope.$watch(()=>$location.path(), value=>{
			if (controller.path !== value) {
				controller.path = value;
				onSrcChange(controller)
			}
		});
	}

	function onSrcChange(controller=this) {
		$ajax.getWordpressPage({src: controller.path}).then(
			data=>applyPage(data, controller)
		);
	}

	function applyNodes(nodeMap, page, controller) {
		Object.keys(nodeMap).forEach(nodeRef=>{
			let node = controller.parent.app[nodeRef];
			if (node) {
				$directive.destroyChildren(node);
				node.empty();
				node.html(page[nodeMap[nodeRef]] || "");
				$compile(node.contents())(controller.current);
			}
		})
	}

	function applyPage(page, controller) {
		if (controller.current) controller.current.$destroy();
		controller.current = controller.parent.$new();
		applyNodes({
			pageHeading: "title",
			articleContent: "content"
		}, page, controller);
		if (controller.path === "/") {
			angular.element("body").addClass("home");
		} else {
			angular.element("body").removeClass("home");
		}
	}

	function wordpressLoadController() {
		let controller = this;
		controller._name = "wordpressLoadController";
	}

	return {
		restrict: "A",
		controllerAs,
		scope: true,
		controller: [wordpressLoadController],
		bindToController: {
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

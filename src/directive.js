angular.module("bolt").factory("boltDirective", [
	"$bolt",
	"objectPath",
	"$q",
	"$window",
($bolt, objectPath, $q, $window) => {
	"use strict";

	const directives = new WeakMap();
	const jQueryMoveMethodMap = {
		before: 'insertBefore',
		after: 'insertAfter',
		last: 'append',
		first: 'prepend'
	};

	function link(_config) {
		const config = parseLinkConfig(_config);

		if (config.addParent) config.controller.parent = config.scope;
		if (config.addRoot) config.controller.root = config.root;

		if (config.addLookups.node) {
			let node = config.root;
			if (node.length) node = node[0];
			pushController(node, config.controller);
		}

		let destructors = [];
		config.controller.destructor = destructor=>destructors.push(destructor);

		if (config.addLookups.scope) pushController(config.scope, config.controller);
		if (config.moveDirective) moveDirective(config.root);
		let unreg = config.controller.parent.$on("$destroy", () => {
			unreg();
			destructors.forEach(destructor => destructor());
			config.controller.root.remove();
			angular.forEach(config.controller, (value, key) => delete config.controller[key]);
			angular.forEach(config, (value, key) => delete config[key]);
			destructors = undefined;
		});
	}

	function getChildControllers(root) {
		let scopes = [];
		root.find("*").each((n, node) => {
			if (has(node)) {
				scopes.push(get(node));
			}
		});

		return $bolt.flatten(scopes);
	}

	function destroyChildren(root) {
		getChildControllers(root).forEach(controller => {
			if (controller.parent && controller.parent.$destroy) controller.parent.$destroy();
		});
	}

	function parseLinkConfig(config) {
		return Object.assign({
			addParent: true,
			addRoot: true,
			addLookups: {
				scope: true,
				node: true
			},
			moveDirective: false
		}, config);
	}

	function moveDirective(node) {
		let placement = node.attr("placement") || "insert";

		if (jQueryMoveMethodMap.hasOwnProperty(placement)) {
			let position = node.attr("position") || "parent";
			position = ((position === "parent") ? node.parent() : node.closest(position));
			node[jQueryMoveMethodMap[placement]](position);
		}
	}

	/**
	 * @description
	 * Setup a watch on a specific controller property.
	 *
	 * @private
	 * @param {Object} controller				The controller instance.
	 * @param {string|Array|function} propName	Controller propert(y|ies)
	 * 											to watch or function to fire.
	 * @param {function} callback				Callback to fire when
	 * 											property changes.
	 */
	function report(controller, propName, callback) {
		let scope = controller.parent;

		if (Array.isArray(propName)) {
			controller.destructor(
				controller.parent.$watch(() => $bolt.copy(controller, propName), values => callback(values, controller), true)
			);
		} else if (angular.isFunction(propName)) {
			controller.destructor(
				scope.$watch(()=> propName(), value => callback(value, controller))
			);
		} else {
			controller.destructor(
				scope.$watch(()=> controller[propName], value => callback(value, controller))
			);
		}
	}

	function evalChain(controller, value) {
		if ((value === undefined) || !angular.isString(value)) return value;
		let _value = controller.parent.$eval(value) || controller.parent.$eval(value, $window) || value;
		if (angular.isString(_value) && ((_value.indexOf("{") === 0) || (_value.indexOf("[") === 0))) {
			try {_value = JSON.parse(_value);} catch (error) {}
		}
		return _value;
	}

	function getPrivateAttributeNames(attributeName) {
		return (Array.isArray(attributeName) ?
				attributeName.map(attributeName => '_' + attributeName) :
			"_" + attributeName
		);
	}

	function reportEvaluate(controller, attributeName, callback, ...parsers) {
		if (angular.isFunction(attributeName)) {
			controller.destructor(controller.parent.$watch(
				() => evalChain(controller, attributeName()),
				value => $bolt.apply({controller, value, attributeName, callback, parsers}),
				true
			));
		} else {
			let _attributeName = getPrivateAttributeNames(attributeName);

			if (Array.isArray(attributeName)) {
				controller.destructor(controller.parent.$watch(() => {
					let value = {};
					_attributeName.forEach(_attributeName => {
						let attributeName = _attributeName.substring(1);
						value[attributeName] = evalChain(controller, controller[_attributeName]);
					});
					return value;
				}, value => $bolt.apply({controller, value, callback, parsers}), true));
			} else {
				controller.destructor(controller.parent.$watch(
					() => evalChain(controller, controller[_attributeName]),
					value => $bolt.apply({controller, value, attributeName, callback, parsers}),
					true
				));
			}
		}
	}

	function pushController(ref, controller) {
		if (!directives.has(ref)) directives.set(ref, []);
		let controllers = directives.get(ref);
		controllers.push(controller);
	}

	function has(ref) {
		return directives.has(ref);
	}

	function get(ref) {
		let controllers = directives.get(ref);
		return ((controllers && controllers.length && (controllers.length === 1)) ? controllers[0] : controllers);
	}

	function set(ref, propName, propValue) {
		return $q.all($bolt.makeArray(get(ref)).map(
			controller => _set(controller, propName, propValue)
		)).then(data => {
			return ((data.length === 1) ? data[0] : data);
		});
	}

	function _set(controller, attributeName, value) {
		return $bolt.apply({controller, attributeName, value});
	}

	return {
		link, get, set, has, report, reportEvaluate,
		getChildControllers, destroyChildren
	};
}]);
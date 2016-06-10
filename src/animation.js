angular.module("bolt").factory("boltAnimation", [
	"$timeout",
	"$q",
	"$window",
($timeout, $q, $window) => {
	"use strict";

	let animations = new WeakMap();

	function stop(node, animation) {
		if (angular.isString(animation) || (animation === undefined)) {
			let controls = getControls(node);
			if (controls) {
				controls.forEach(control => {
					if ((animation === undefined) || (control.type === animation) || (control.typeGroup === animation)) control.stop = true;
				});
			}
		} else {
			let control = getControl(node, animation);
			if (control) control.stop = true;
		}
	}

	function pause(node, animation) {
		if (angular.isString(animation) || (animation === undefined)) {
			let controls = getControls(node);
			if (controls) {
				controls.forEach(control => {
					if ((animation === undefined) || (control.type === animation) || (control.typeGroup === animation)) control.pause = true;
				});
			}
		} else {
			let control = getControl(node, animation);
			if (control) control.pause = true;
		}
	}

	function start(node, animation) {
		if (angular.isString(animation) || (animation === undefined)) {
			let controls = getControls(node);
			if (controls) {
				controls.forEach(control => {
					if ((animation === undefined) || (control.type === animation) || (control.typeGroup === animation)) control.pause = false;
				});
			}
		} else {
			let control = getControl(node, animation);
			if (control) control.pause = false;
		}
	}

	function setControl(node, animation, control) {
		if (!animations.has(node)) animations.set(node, new Map());
		let lookup = animations.get(node);
		lookup.set(animation, control);
		return control;
	}

	function getControl(node, animation) {
		let lookup = getControls(node);
		if (lookup) {
			if (lookup.has(animation)) return lookup.get(animation);
		}
	}

	function getControls(node) {
		if (animations.has(node)) {
			return animations.get(node);
		}
	}

	function deleteControl(node, animation) {
		let lookup = getControls(node);
		if (lookup) {
			if (lookup.has(animation)) return lookup.delete(animation);
		}
	}

	function fadeOut(node, duration) {
		let control = {paused: false, stop:false, type:"fadeOut", typeGroup: "fade"};
		let animation = $q(resolve => {
			node = angular.element(node);
			node.css("opacity", 1);
			let opacity = 1;
			let steps = parseInt(duration / 16, 10) + 1;
			let decrements = (1/steps);
			stop(node, "fade");

			let animate = ()=>{
				if (control && !control.pause && !control.stop) {
					opacity -= decrements;
					if (opacity < 0) opacity = 0;
					node.css("opacity", opacity);
					steps--;
				}
				if (control && (steps > 0) && !control.stop) {
					$window.requestAnimationFrame(animate);
				} else {
					deleteControl(node, animation);
					resolve(node);
				}
			};

			$window.requestAnimationFrame(animate);
		});

		setControl(node, animation, control);
		return animation;
	}

	function fadeIn(node, duration) {
		let control = {paused: false, stop:false, type:"fadeIn", typeGroup: "fade"};
		let animation = $q(resolve => {
			node = angular.element(node);
			node.css("opacity", 0);
			let opacity = 0;
			let steps = parseInt(duration / 16, 10) + 1;
			let increments = (1/steps);
			stop(node, "fade");

			let animate = ()=>{
				if (control && !control.pause && !control.stop) {
					opacity += increments;
					if (opacity > 1) opacity = 1;
					node.css("opacity", opacity);
					steps--;
				}
				if (control && (steps > 0) && !control.stop) {
					$window.requestAnimationFrame(animate);
				} else {
					deleteControl(node, animation);
					resolve(node);
				}
			};

			$window.requestAnimationFrame(animate);
		});

		setControl(node, animation, control);
		return animation;
	}


	return {
		start, stop, pause, fadeIn, fadeOut
	};
}]);

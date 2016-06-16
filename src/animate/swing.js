angular.module("bolt").directive("hoverSwing", () => {
	"use strict";

	return {
		restrict: "A",
		link: (scope, root) => {
			root.hover(() => {
				root.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", ()=> {
					root.removeClass("animated swing")
				});
				root.addClass("animated swing");
			});
		}
	};
});

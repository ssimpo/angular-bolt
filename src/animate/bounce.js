angular.module("bolt").directive("hoverBounce", () => {
	"use strict";

	return {
		restrict: "A",
		link: (scope, root) => {
			root.hover(() => {
				root.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", ()=> {
					root.removeClass("animated bounce")
				});
				root.addClass("animated bounce");
			});
		}
	};
});

angular.module("bolt").directive("hoverTada", () => {
	"use strict";

	return {
		restrict: "A",
		link: (scope, root) => {
			root.hover(() => {
				root.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", ()=> {
					root.removeClass("animated tada")
				});
				root.addClass("animated tada");
			});
		}
	};
});

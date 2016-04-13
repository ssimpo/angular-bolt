angular.module("bolt").factory("boltImage", [
	"$document",
	"$q",

	function($document, $q) {
		"use strict";

		function getImageData(src, width, height) {
			return loadImage(src).then(function(imageNode) {
				var position = calcPosition(imageNode, width, height);
				return getPixelData(imageNode, position);
			});
		}

		function getPixelData(imageNode, position) {
			var canvas = createCanvasForImage(imageNode);
			var context = canvas[0].getContext("2d");
			context.drawImage(imageNode,
				0, 0, imageNode.width, imageNode.height,
				0, 0, position.width, position.height
			);
			var data = context.getImageData(0, 0, position.width, position.height);
			data.left = position.left;
			data.top = position.top;

			angular.element(canvas).remove();
			angular.element(imageNode).remove();

			return data;
		}

		function loadImage(src) {
			var imageNode = new Image();
			imageNode.src = src;

			return $q(function(resolve, reject) {
				angular.element(imageNode).on("load", function() {
					resolve(imageNode);
				});
			});
		}

		function createCanvasForImage(imageNode) {
			var canvas = angular.element("<canvas></canvas>");

			return copyDimensionsToCanvas(imageNode, canvas);
		}

		function copyDimensionsToCanvas(imageNode, canvasNode) {
			angular.element(canvasNode).attr({
				width: imageNode.width,
				height: imageNode.height
			});

			return canvasNode;
		}

		function calcPosition(image, width, height) {
			width = width || image.width;
			height = height || image.height;

			var aspect = width / height;
			var imageAspect = image.width / image.height;
			var position = {
				height: height, width: width,
				left: 0, top: 0
			};

			if(imageAspect < aspect) {
				position.width = parseInt(image.width * (position.height / image.height), 10);
				position.left = parseInt((width - position.width) / 2, 10);
			} else if(imageAspect > aspect) {
				position.height = parseInt(image.height * (position.height / image.width), 10);
				position.top = parseInt((height - position.height) / 2, 10);
			}

			return position;
		}

		return {
			getImageData: getImageData
		};
	}]);
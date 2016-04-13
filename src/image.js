angular.module("bolt").factory("boltImage", [
	"$document",
	"$q",

	function($document, $q) {
		"use strict";

		var colourSequence = ["r", "g", "b", "a"];

		function getImageData(src, width, height) {
			// @todo	Deal with missing images - return undefined?
			return loadImage(src).then(function(imageNode) {
				var position = calcPosition(imageNode, width, height);
				return getPixelData(imageNode, position);
			});
		}

		function getBlock(data, position) {
			if ((position.x >= data.width) || (position.y >= data.height)) {
				return undefined
			}
			position = correctPosition(data, position);

			var block = new ImageData(
				new Uint8ClampedArray(position.width * position.height * 4),
				position.width, position.height
			);
			block.left = position.x + (position.left || 0);
			block.top = position.y + (position.top || 0);
			var count = 0;

			for (var y = position.y; y < (position.height + position.y); y++) {
				for (var x = position.x; x < (position.width + position.x); x++) {
					var pixel = getPixel(data, x, y);

					colourSequence.forEach(function(colour) {
						block.data[count++] = pixel[colour]
					});
				}
			}

			//console.log(position.x, position.y, position.width, position.height, block.data.length);

			return block;
		}

		function correctPosition(data, position) {
			if ((position.x + position.width) >= data.width) {
				position.width = data.width - position.x;
			}
			if ((position.y + position.height) >= data.height) {
				position.height = data.height - position.y;
			}

			return position;
		}

		function getPixel(data, x, y) {
			var pos = (((data.width * y) + x) * 4);

			return {
				r: data.data[pos++],
				g: data.data[pos++],
				b: data.data[pos++],
				a: data.data[pos]
			};
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
			getImageData: getImageData,
			getBlock: getBlock,
			getPixel: getPixel
		};
	}]);
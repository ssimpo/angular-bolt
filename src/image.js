angular.module("bolt").factory("boltImage", [
	"$document",
	"$q",
	"$http",
	"boltImageJpg",

	function($document, $q, $http, $jpg) {
		"use strict";

		var colourSequence = ["r", "g", "b", "a"];

		function getImageData(src, width, height) {
			// @todo	Deal with missing images - return undefined?

			return loadImage2(src).then(function(data) {
				return jpgDataToImageData(data, width, height);
			});
		}

		function jpgDataToImageData(jpgData, width, height) {
			var parser = getJpgData(jpgData);
			var position = calcPosition(parser, width, height);
			var iData = getPositionedImageData(position);
			iData = copyToImageData(parser, iData);
			(parser.components || []).forEach(function(component) {
				delete component.output;
			});
			return iData;
		}

		function getJpgData(data) {
			var parser = new $jpg.JpegDecoder();
			parser.parse(data);
			return parser;
		}

		function getPositionedImageData(position) {
			var iData = new ImageData(position.width, position.height);
			iData.left = position.left;
			iData.top = position.top;
			return iData;
		}

		function cloneImageData(data) {
			return new ImageData(
				new Uint8ClampedArray(data.data),
				data.width, data.height
			)
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

		function rgbaToHsla(pixel){
			var r = pixel.r / 255;
			var g = pixel.g / 255;
			var b = pixel.b / 255;
			var a = (pixel.a | 255) / 255;

			var max = Math.max(r, g, b)
			var min = Math.min(r, g, b);

			var hsla = {
				h: 0,
				s: 0,
				l: (max + min) / 2,
				a: a,
				x: pixel.x,
				y: pixel.y
			};

			if (max == min) {
				hsla.h = hsla.s = 0; // achromatic
			} else {
				var diff = max - min;

				hsla.s = ((hsla.l > 0.5) ? diff / (2 - max - min) : diff / (max + min));
				switch(max){
					case r: hsla.h = (g - b) / diff + ((g < b) ? 6 : 0); break;
					case g: hsla.h = (b - r) / diff + 2; break;
					case b: hsla.h = (r - g) / diff + 4; break;
				}
				hsla.h /= 6;
			}

			return hsla;
		}

		function hue2rgb(p, q, t){
			if(t < 0) t += 1;
			if(t > 1) t -= 1;
			if(t < 1/6) return p + (q - p) * 6 * t;
			if(t < 1/2) return q;
			if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		}

		function hslaToRgba(pixel) {
			var rgba = {
				r: 0,
				g: 0,
				b: 0,
				a: Math.round((pixel.a || 1) * 255),
				x: pixel.x,
				y: pixel.y
			};

			if (pixel.s == 0) {
				rgba.r = rgba.g = rgba.b = pixel.l; // achromatic
			} else {
				var q = (
					(pixel.l < 0.5) ?
						pixel.l * (1 + pixel.s) :
						pixel.l + pixel.s - pixel.l * pixel.s
				);
				var p = 2 * pixel.l - q;
				rgba.r = hue2rgb(p, q, pixel.h + 1/3);
				rgba.g = hue2rgb(p, q, pixel.h);
				rgba.b = hue2rgb(p, q, pixel.h - 1/3);
			}

			rgba.r = Math.round(rgba.r * 255);
			rgba.g = Math.round(rgba.g * 255);
			rgba.b = Math.round(rgba.b * 255);

			return rgba;
		}

		function getPixel(data, x, y, colourSpace) {
			colourSpace = (colourSpace || "").toLowerCase();

			var pos = (((data.width * y) + x) * 4);
			var pixel = {
				r: data.data[pos++],
				g: data.data[pos++],
				b: data.data[pos++],
				a: data.data[pos],
				x: x,
				y: y
			};

			if (colourSpace === "rgb") {
				delete pixel.a;
			} else if ((colourSpace === "hsl") || (colourSpace === "hsla")) {
				pixel = rgbaToHsla(pixel);
				if (colourSpace === "hsl") {
					delete pixel.a;
				}
			}

			return pixel;
		}

		function setPixel(data, pixel) {
			var pos = (((data.width * (pixel.y + (pixel.top || 0))) + (pixel.x + (pixel.left || 0))) * 4);

			if (!pixel.hasOwnProperty("r") && !pixel.hasOwnProperty("g") && !pixel.hasOwnProperty("b")) {
				if (pixel.hasOwnProperty("h") && pixel.hasOwnProperty("s") && pixel.hasOwnProperty("l")) {
					pixel = hslaToRgba(pixel);
				}
			}

			data.data[pos++] = pixel.r;
			data.data[pos++] = pixel.g;
			data.data[pos++] = pixel.b;
			data.data[pos] = pixel.a;

			return pixel;
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

		function loadImageFromBase64DataUrl(src) {
			return $q(function(resolve, reject) {
				var offset = src.indexOf("base64,") + 7;
				var data = atob(src.substring(offset));
				var arr = new Uint8Array(data.length);
				for (var i = data.length - 1; i >= 0; i--) {
					arr[i] = data.charCodeAt(i);
				}
				resolve(arr.buffer);
			});
		}

		function loadImageFromBinaryHttpRequest(src) {
			return $http.get(src, {
				responseType: "arraybuffer"
			}).then(function(response) {
				var data = new Uint8Array(response.data);
				delete response.data;
				return data;
			});
		}

		function loadImage2(src) {
			return (src.indexOf("data:") === 0) ?
				loadImageFromBase64DataUrl(src) :
				loadImageFromBinaryHttpRequest(src);
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

		function copyToImageData(parser, imageData) {
			if (parser.numComponents === 2 || parser.numComponents > 4) {
				throw new Error('Unsupported amount of components');
			}

			var width = imageData.width, height = imageData.height;
			var imageDataBytes = width * height * 4;
			var imageDataArray = imageData.data;

			var i, j;
			if (parser.numComponents === 1) {
				var values = parser.getData(width, height, false);
				for (i = 0, j = 0; i < imageDataBytes;) {
					var value = values[j++];
					imageDataArray[i++] = value;
					imageDataArray[i++] = value;
					imageDataArray[i++] = value;
					imageDataArray[i++] = 255;
				}
				return;
			}

			var rgb = parser.getData(width, height, true);
			for (i = 0, j = 0; i < imageDataBytes;) {
				imageDataArray[i++] = rgb[j++];
				imageDataArray[i++] = rgb[j++];
				imageDataArray[i++] = rgb[j++];
				imageDataArray[i++] = 255;
			}

			return imageData;
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
			cloneImageData: cloneImageData,
			getImageData: getImageData,
			getBlock: getBlock,
			getPixel: getPixel,
			setPixel: setPixel
		};
	}]);
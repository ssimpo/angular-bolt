angular.module("bolt").factory("boltImageAnimations", [
	"$bolt",
	"boltImage",
	"$timeout",

	function($bolt, $image, $timeout) {

		function run(controller) {
			$timeout(function(){
				requestAnimationFrame(function() {
					if (controller && controller.animations && controller.animations.length) {
						var animation = controller.animations.shift();
						animation();
						animation = undefined;
					}
					run(controller);
				});
			}, 1000 / (controller.framerate || 0));
		}

		function getBlockSizes(data, steps, blockCols) {
			var increments = parseInt(((data.width / blockCols) / steps), 10);
			var sizes = [];

			for(var i = 1; i <= steps; i++) {
				sizes.push(increments * i);
			}

			return sizes;
		}

		function getArrayOfAllDataPoints(data) {
			var points = [];
			for (var x = 0; x < data.width; x++) {
				for (var y = 0; y < data.height; y++) {
					points.push({x:x, y:y});
				}
			}

			return points;
		}

		function createDisolveAnimation(data, controller) {
			var points = $bolt.shuffle(getArrayOfAllDataPoints(data));
			var steps = parseInt(points.length / controller.steps, 10);
			var animations = [];
			var frameData = [];
			frameData[-1] = controller.canvas.getImageData(0, 0, controller.width, controller.height);

			$bolt.chunk(points, steps).forEach(function(groups, index) {
				frameData.push($image.cloneImageData(frameData[index-1]));

				groups.forEach(function(point) {
					var pixel = $image.getPixel(data, point.x, point.y);
					pixel.x += (data.left || 0);
					pixel.y += (data.top || 0)
					$image.setPixel(frameData[index], pixel);
				});

				animations.push(function(){
					controller.canvas.putImageData(frameData[index], 0, 0);
					delete frameData[index-1];
				});
			});

			animations.push(function() {
				delete frameData[steps -1];
				frameData = undefined;
			});

			return animations;
		}

		function createBlockAnimation(data, controller) {
			var animations = [];
			var sizes = getBlockSizes(data, controller.steps, 10);
			var maxSize = sizes[sizes.length -1];
			var count = 0;

			sizes.forEach(function(size) {
				var blocks = [];
				for (var x=0; x < controller.width; x+=maxSize) {
					for (var y = 0; y < controller.height; y+=maxSize) {
						var block = $image.getBlock(data, {
							x: x, y: y,
							width: size, height: size,
							left: data.left,
							top: data.top
						});

						if (block) {
							blocks.push(block);
						}
					}
				}

				var cAnimation = blocks.map(function(block) {
					return function() {
						controller.canvas.putImageData(
							block,
							block.left, block.top,
							0, 0,
							block.width, block.height
						);
					};
				});

				animations.push(function () {
					cAnimation.forEach(function (animation) {
						animation();
					});
				});
			});

			return animations;
		}

		return {
			"run": run,
			"createDisolveAnimation": createDisolveAnimation,
			"createBlockAnimation": createBlockAnimation
		};
	}]);
angular.module("bolt").factory("boltImageAnimations", [
	"$bolt",
	"boltImage",
	"$rootScope",
	"$timeout",

	function($bolt, $image, $scope, $timeout) {

		function run(options) {
			var runner = {
				framerate: options.framerate
			};

			createAnimationRunner(options, runner);
			$scope.$watch(function() {
				return options.framerate
			}, function(framerate) {
				if (framerate !== runner.framerate) {
					runner.framerate = framerate;
					runner.stop();
					createAnimationRunner(options, runner);
				}
			});
		}

		function animate(data, options) {
			var type = (options.animationType || "").toLowerCase();
			if (type === "blocks") {
				return createBlockAnimation(data, options);
			}
			if (type === "dissolve") {
				return createDissolveAnimation(data, options);
			}
		}

		function createAnimationRunner(options, runner) {
			runner.timer = $timeout(function(){
				requestAnimationFrame(function() {
					if (options && options.animations && options.animations.length) {
						var animation = options.animations.shift();
						animation();
						animation = undefined;
					}
					createAnimationRunner(options, runner);
				});
			}, 1000 / (options.framerate || 0));

			runner.stop = function() {
				$timeout.cancel(runner.timer);
			};
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

		function getFreshAnimationArray(options) {
			var animations;

			if (options.animations && angular.isArray(options.animations)) {
				options.animations.splice(0, options.animations.length);
				animations = options.animations;
			} else {
				animations = [];
			}

			return animations;
		}

		function createDissolveAnimation(data, options) {
			var animations = getFreshAnimationArray(options);
			var points = $bolt.shuffle(getArrayOfAllDataPoints(data));
			var steps = parseInt(points.length / options.steps, 10);
			var frameData = [];
			frameData[-1] = options.canvas.getImageData(0, 0, options.width, options.height);

			$bolt.chunk(points, steps).forEach(function(groups, index) {
				frameData.push($image.cloneImageData(frameData[index-1]));

				groups.forEach(function(point) {
					var pixel = $image.getPixel(data, point.x, point.y);
					pixel.x += (data.left || 0);
					pixel.y += (data.top || 0)
					$image.setPixel(frameData[index], pixel);
				});

				animations.push(function(){
					options.canvas.putImageData(frameData[index], 0, 0);
					delete frameData[index-1];
				});
			});

			animations.push(function() {
				delete frameData[steps -1];
				frameData = undefined;
			});

			return animations;
		}

		function createBlockAnimation(data, options) {
			var animations = getFreshAnimationArray(options);
			var sizes = getBlockSizes(data, options.steps, 10);
			var maxSize = sizes[sizes.length -1];

			sizes.forEach(function(size) {
				var blocks = [];
				for (var x=0; x < options.width; x+=maxSize) {
					for (var y = 0; y < options.height; y+=maxSize) {
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
						options.canvas.putImageData(
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
			"animate": animate
		};
	}]);
(function() {
	'use strict';
	angular.module('AngularEsriPlaygroundApp').controller('BasemapComparisonController', ['$route', '$scope', '$window', 'appConfig', function($route, $scope, $window, appConfig) {
		$scope.subtitle = appConfig.basemapComparison.subtitle;
		$scope.$emit('subtitle-change', $scope.subtitle);

		$scope.basemaps = appConfig.basemapsFlattened;

		$scope.map = {
			center: {
				// Crater Lake, OR
				// lng: -122.110,
				// lat: 42.940

				// Tristan da Cunha
				lng: -12.225,
				lat: -37.116
			},
			zoom: 11
		};

		// $scope.$on('$routeChangeStart', function(e) {
		// 	console.log(e);
		// 	e.preventDefault();
		// 	// $window.location.reload();
		// 	$route.reload();
		// });
	}]);

	angular.module('AngularEsriPlaygroundApp').directive('esriSimpleMap', ['$q', '$timeout', '$window', 'esriLoader', function($q, $timeout, $window, esriLoader) {
		return {
			// element only directive
			restict: 'E',

			// isolate the scope
			scope: {
				// 2-way object binding
				basemap: '@',
				center: '=',
				zoom: '='
			},

			compile: function($element, $attrs) {
				// remove the id attribute from the main element
				$element.removeAttr('id');
				// append a new div inside this element, this is where we will create our map
				$element.append('<div id=' + $attrs.id + '></div>');
				// since we are using compile we need to return our linker function
				// the 'link' function handles how our directive responds to changes in $scope
				// jshint unused: false
				return function(scope, element, attrs, controller) {};
			},

			controller: function($scope, $element, $attrs) {
				var mapDeferred = $q.defer();
				// var esriApp = {};

				esriLoader.require([
					'esri/map'
				], function(
					Map
				) {
					// construct the map
					var map = new Map($attrs.id, {
						basemap: $scope.basemap,
						center: [$scope.center.lng, $scope.center.lat],
						zoom: $scope.zoom,
						slider: false
					});

					// after map is loaded, add layers and set up angular $scope watches
					map.on('load', function(e) {
						map.disableDoubleClickZoom();
						mapDeferred.resolve(map);
					});

					mapDeferred.promise.then(function(map) {
						// manually add material design whiteframe class to map zoom buttons
						// domClass.add('map_zoom_slider', 'md-whiteframe-z2');
						// resize just to be safe

						$scope.inUpdateCycle = false;

						$scope.$watchGroup([
							'center.lng', 'center.lat', 'zoom'
						], function(newCenterZoom, oldCenterZoom) {
							if ($scope.inUpdateCycle) {
								return;
							}

							// $log.log('center/zoom changed', newCenterZoom, oldCenterZoom);
							// newCenterZoom = newCenterZoom.split(',');
							if (newCenterZoom[0] !== '' && newCenterZoom[1] !== '' && newCenterZoom[2] !== '') {
								$scope.inUpdateCycle = true; // prevent circular updates between $watch and $apply
								map.centerAndZoom([newCenterZoom[0], newCenterZoom[1]], newCenterZoom[2]).then(function() {
									// $log.log('after centerAndZoom()');
									$scope.inUpdateCycle = false;
								});
							}
						});

						map.on('extent-change', function(e) {
							if ($scope.inUpdateCycle) {
								return;
							}

							$scope.inUpdateCycle = true; // prevent circular updates between $watch and $apply

							// $log.log('extent-change geo', map.geographicExtent);

							$scope.$apply(function() {
								var geoCenter = map.geographicExtent.getCenter();

								$scope.center.lng = geoCenter.x;
								$scope.center.lat = geoCenter.y;
								$scope.zoom = map.getZoom();

								// we might want to execute event handler even if $scope.inUpdateCycle is true
								if ($attrs.extentChange) {
									$scope.extentChange()(e);
								}

								$timeout(function() {
									// this will be executed after the $digest cycle
									// $log.log('after apply()');
									$scope.inUpdateCycle = false;
								}, 0);
							});
						});

						// map.resize();
						map.reposition();

						// clean up
						$scope.$on('$destroy', function() {
							map.destroy();
						});
					});
				});
			}
		};
	}]);
})(angular);

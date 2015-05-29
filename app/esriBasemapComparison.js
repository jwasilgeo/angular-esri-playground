(function() {
	'use strict';
	angular.module('AngularEsriPlaygroundApp').controller('BasemapComparisonController', ['$scope', function($scope) {
		$scope.subtitle = 'Basemap Comparison';
		$scope.$emit('subtitle-change', $scope.subtitle);

		$scope.mapLoaded = false;

		$scope.basemapActive = 'dark-gray';
		// $scope.basemaps = {
		// 	'reference': ['topo', 'terrain', 'streets', 'oceans', 'national-geographic'],
		// 	'imagery': ['satellite', 'hybrid'],
		// 	'hipster': ['gray', 'dark-gray'],
		// 	'third party': ['osm']
		// };
		$scope.basemaps = ['topo', 'terrain', 'streets', 'oceans', 'national-geographic'];
	}]);

	angular.module('AngularEsriPlaygroundApp').directive('esriSimpleMap', ['$q', '$log', function($q, $log) {
		return {
			// element only directive
			restict: 'E',

			// isolate the scope
			scope: {
				// 2-way object binding
				mapLoaded: '=',
				basemap: '='
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
				var esriApp = {};

				require([
					'esri/map'
				], function(
					Map
				) {
					// map-related functions and business logic
					var changeBasemap = function(basemap) {
						if (esriApp.map.getBasemap() !== basemap) {
							esriApp.map.setBasemap(basemap);
						}
					};

					// construct the map
					esriApp.map = new Map($attrs.id, {
						basemap: $scope.basemap,
						center: [16, 3.5], // longitude, latitude
						zoom: 4
					});

					// after map is loaded, add layers and set up angular $scope watches
					esriApp.map.on('load', function(e) {
						mapDeferred.resolve(esriApp);
					});

					mapDeferred.promise.then(function(esriApp) {
						$scope.$watch('mapLoaded', function(newValue) {
							$log.log('mapLoaded: ', newValue);
						});

						/*$scope.$watch('basemapActive', function(newValue) {
							changeBasemap(newValue);
						});*/

						// loaded should be true by now
						$scope.mapLoaded = esriApp.map.loaded;

						// manually add material design whiteframe class to map zoom buttons
						// domClass.add('map_zoom_slider', 'md-whiteframe-z2');
						// resize just to be safe
						// esriApp.map.resize();
						// esriApp.map.reposition();

						esriApp.map.on('extent-change', function(evt) {
							$log.log('tell the world');
						});

						// clean up
						$scope.$on('$destroy', function() {
							esriApp.map.destroy();
						});
					});
				});
			}
		};
	}]);
})(angular);
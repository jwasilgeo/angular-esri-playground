(function() {
	'use strict';
	angular.module('AngularEsriPlaygroundApp', ['ngRoute', 'ngMaterial', 'esri.core']);

	angular.module('AngularEsriPlaygroundApp').config(function($routeProvider) {
		$routeProvider
			.when('/point-renderers', {
				templateUrl: 'app/esriPointRenderersMap.html',
				controller: 'PointRenderersController'
			})
			.when('/basemap-comparison', {
				templateUrl: 'app/esriBasemapComparison.html',
				controller: 'BasemapComparisonController'
			})
			.otherwise({
				redirectTo: '/point-renderers'
			});

	});

	angular.module('AngularEsriPlaygroundApp').controller('AngularEsriPlaygroundController', ['$scope', function($scope) {
		$scope.subtitle = '...';
		$scope.$on('subtitle-change', function(evt, newSubtitle) {
			$scope.subtitle = newSubtitle;
		});
	}]);

})(angular);

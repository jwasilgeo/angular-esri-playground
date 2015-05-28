(function() {
	'use strict';
	angular.module('PointRenderersMapApp', ['ngMaterial']);

	angular.module('PointRenderersMapApp').controller('PointRenderersController', ['$scope', function($scope) {
		$scope.mapLoaded = false;

		$scope.rendererActive = 'heatmap';
		$scope.renderers = ['heatmap', 'cluster'];

		$scope.heatmapRendererParams = {
			blurRadius: 12,
			minPixelIntensity: 0,
			maxPixelIntensity: 100
		};
		$scope.clusterTolerance = 70;

		$scope.basemapActive = 'dark-gray';
		$scope.basemaps = {
			'reference': ['topo', 'terrain', 'streets', 'oceans', 'national-geographic'],
			'imagery': ['satellite', 'hybrid'],
			'hipster': ['gray', 'dark-gray'],
			'third party': ['osm']
		};

	}]);
})(angular);
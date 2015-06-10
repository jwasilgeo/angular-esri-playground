(function() {
	'use strict';
	var basemapsGrouped = {
		'reference': ['topo', 'terrain', 'streets', 'oceans', 'national-geographic'],
		'imagery': ['satellite', 'hybrid'],
		'hipster': ['gray', 'dark-gray'],
		'third party': ['osm']
	};
	var basemapsFlattened = [];
	angular.forEach(basemapsGrouped, function(v, k) {
		basemapsFlattened = basemapsFlattened.concat(v);
	});
	// basemapsFlattened: ['topo', 'satellite', 'hybrid', 'osm', 'terrain', 'streets', 'oceans', 'national-geographic', 'gray', 'dark-gray'],

	var config = {
		basemapActive: 'dark-gray',
		basemapsGrouped: basemapsGrouped,
		basemapsFlattened: basemapsFlattened,

		pointRenderers: {
			subtitle: 'Point Renderers',
			mapOptions: {
				center: [16, 3.5],
				zoom: 4
			},
			layer: {
				// url: 'http://services.arcgis.com/BG6nSlhZSAWtExvp/arcgis/rest/services/World_Volcanoes/FeatureServer/0',
				url: 'http://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Cities/FeatureServer/0',
				objectIdField: 'FID'
			},
			heatmapRendererParams: {
				blurRadius: 12,
				minPixelIntensity: 0,
				maxPixelIntensity: 100
			},
			clusterTolerance: 70,
			rendererActive: 'heatmap',
			renderers: ['heatmap', 'cluster']
		},

		basemapComparison: {
			subtitle: 'Basemap Comparison'
		}
	};

	angular.module('AngularEsriPlaygroundApp').constant('appConfig', config);

})(angular);
(function() {
	'use strict';
	angular.module('AngularEsriPlaygroundApp').controller('EsriGeocodeMdAutocompleteController', [
		'$q', '$http', '$scope', 'esriRegistry', 'esriLoader',
		function($q, $http, $scope, esriRegistry, esriLoader) {
			$scope.selectedItem = null;
			$scope.searchText = null;
			$scope.notFoundMessage = 'No matches found.';
			$scope.queryGeocodeSuggest = queryGeocodeSuggest;
			$scope.queryGeocodeFind = queryGeocodeFind;

			// use registry pattern to get reference to the map in another scope
			// and load	Esri Dojo modules to help with changing the map's extent
			var mapDirectiveReference,
				EsriExtent,
				EsriSpatialReference;

			esriRegistry.get('registeredPointRenderersMapDirective').then(function(directiveReference) {
				mapDirectiveReference = directiveReference;
				esriLoader.require([
					'esri/geometry/Extent', 'esri/SpatialReference'
				], function(Extent, SpatialReference) {
					EsriExtent = Extent;
					EsriSpatialReference = SpatialReference;
				});
			});

			function queryGeocodeSuggest(query) {
				var deferred = $q.defer();
				var requestConfig = {
					url: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest',
					params: {
						text: query,
						category: 'Address,Postal,Populated Place',
						f: 'json'
					}
				};

				$http(requestConfig).success(function(data) {
					var scrubbedSuggestions = data.suggestions.map(function(suggestion) {
						return {
							value: suggestion,
							display: suggestion.text,
						};
					});
					deferred.resolve(scrubbedSuggestions);
				}).error(function(err) {
					console.log(err);
					deferred.reject(err);
				});

				return deferred.promise;
			}

			function queryGeocodeFind(query) {
				if (angular.isObject(query)) {
					var requestConfig = {
						url: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find',
						params: {
							text: query.value.text,
							magicKey: query.value.magicKey || null,
							outSR: 102100,
							maxLocations: query.value.isCollection ? 10 : 1,
							f: 'json'
						}
					};

					$http(requestConfig)
						.success(function(data) {
							if (data.locations.length > 0) {
								manipulateMap(data);
							}
						})
						.error(function(err) {
							console.log(err);
						});
				}
			}

			function manipulateMap(geocodedData) {
				var extent = new EsriExtent(
					geocodedData.locations[0].extent.xmin,
					geocodedData.locations[0].extent.ymin,
					geocodedData.locations[0].extent.xmax,
					geocodedData.locations[0].extent.ymax,
					new EsriSpatialReference(geocodedData.spatialReference.wkid));
				mapDirectiveReference.map.setExtent(extent, true);
			}

		}
	]);
})(angular);

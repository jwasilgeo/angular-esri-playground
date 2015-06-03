(function() {
	'use strict';
	angular.module('AngularEsriPlaygroundApp').controller('EsriGeocodeMdAutocompleteController', ['$q', '$http', '$scope', '$filter', function($q, $http, $scope, $filter) {
		$scope.selectedItem = null;
		$scope.searchText = null;
		$scope.notFoundMessage = 'No matches found.';
		$scope.queryGeocodeSuggest = queryGeocodeSuggest;
		$scope.queryGeocodeFind = queryGeocodeFind;

		function queryGeocodeSuggest(query) {
			console.log(query);
			var deferred = $q.defer();

			var requestConfig = {
				url: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest',
				params: {
					text: query,
					f: 'json'
				}
			};

			$http(requestConfig).success(function(data) {
				var dataMapping = data.suggestions.map(function(suggestion) {
					return {
						value: suggestion,
						display: suggestion.text,
						shortDisplay: suggestion.text.length < 18 ? suggestion.text : ($filter('limitTo')(suggestion.text, 18)) + '...',
					};
				});
				deferred.resolve(dataMapping);
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
						magicKey: query.value.magicKey,
						outSR: 102100,
						maxLocations: query.value.isCollection ? 10 : 1,
						f: 'json'
					}
				};

				$http(requestConfig)
					.success(function(data) {
						$scope.$parent.geocodedData = data;
					})
					.error(function(err) {
						console.log(err);
					});
			}
		}

	}]);
})(angular);
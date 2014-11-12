'use strict';

/**
 * D3 service for injection!
 * Loads the D3 js directly from the official server,
 * and returns the d3 object as a promise.
 */
angular.module('d3', [])
.factory('d3Service', ['$document', '$q', '$rootScope',
	function($document, $q, $rootScope) {
		
		var d = $q.defer();

		function onScriptLoad() {
			//load client in browser, pass window.d3 to callbacks
			$rootScope.$apply(function () { d.resolve(window.d3);	});
		}

		//create a script tag with d3 as the source
		//and call onScriptLoad callback when loaded.
		var scriptTag = $document[0].createElement('script');
		scriptTag.type = 'text/javascript';
		scriptTag.async = true;
		scriptTag.src = 'http://d3js.org/d3.v3.min.js';
		//legacy for IE
		scriptTag.onreadystatechange = function() {
			if (this.readyState == 'complete')
				onScriptLoad();
		};
		//all browser callback
		scriptTag.onload = onScriptLoad;

		var s = $document[0].getElementsByTagName('body')[0];
		s.appendChild(scriptTag);

		return {
			d3: function() { return d.promise;	}
		};
	}
]);
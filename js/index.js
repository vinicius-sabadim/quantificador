angular
	.module('meuApp', []);

angular
	.module('meuApp')
	.controller('PrincipalController', PrincipalController);

PrincipalController.$inject = ['$scope'];

function PrincipalController($scope) {

	$scope.tratarTecla = tratarTecla;
	$scope.adicionar = adicionar;

	function init() {
		$scope.configs = [{
			evento: 'Latência',
			tempo: true,
			teclaComeco: 'Q',
			teclaFim: 'W',
			inicio: 0,
			duracao: 0,
			tecla: '',
			contador: 0
		}];
	}

	function tratarTecla(keyEvent) {
		quantificar(String.fromCharCode(keyEvent.keyCode));
	}

	function quantificar(tecla) {
		for (var i = 0, len = $scope.configs.length; i < len; i += 1) {
			if ($scope.configs[i].tempo) {
				if ($scope.configs[i].teclaComeco === tecla) {
					$scope.configs[i].inicio = new Date();
				} else if ($scope.configs[i].teclaFim === tecla && $scope.configs[i].inicio !== 0) {
					$scope.configs[i].duracao += (new Date() - $scope.configs[i].inicio) / 1000;
					$scope.configs[i].inicio = 0;
				}
			} else {
				if($scope.configs[i].tecla === tecla) {
					$scope.configs[i].contador += 1;
				}
			}
		}
	}

	function adicionar() {
		$scope.configs.push({
			evento: '',
			tempo: false,
			teclaComeco: '',
			teclaFim: '',
			inicio: null,
			duracao: 0,
			tecla: '',
			contador: 0
		});
	}

	init();
}
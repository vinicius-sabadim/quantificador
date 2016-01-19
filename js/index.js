angular
	.module('meuApp', []);

angular
	.module('meuApp')
	.controller('PrincipalController', PrincipalController);

PrincipalController.$inject = ['$scope'];

function PrincipalController($scope) {

	$scope.ae = function() {
		console.log('ae');
	}

	$scope.tratarTecla = tratarTecla;
	$scope.adicionar = adicionar;
	$scope.toggleBotao = toggleBotao;

	function init() {
		$scope.textoBotao = 'Ocultar';
		$scope.mostrar = false;
		$scope.eventos = [new Evento('Tempo', 'Q', 'W'), new Evento('Contador','A')];
	}

	function Evento(nome, tecla, tecla2) {
		nome = nome || '';
		tecla = tecla || '';
		tecla2 = tecla2 || '';

		this.nome = nome;
		this.tempo = !!tecla2;
		this.config = {
			tecla: tecla,
			teclaFim: tecla2,
			inicio: 0,
			duracao: 0,
			contador: 0
		};
		return this;
	}

	function toggleBotao() {
		$scope.mostrar = !$scope.mostrar;
		$scope.mostrar ? $scope.textoBotao = 'Mostrar' : $scope.textoBotao = 'Ocultar';
	}

	function tratarTecla(keyEvent) {
		quantificar(String.fromCharCode(keyEvent.keyCode));
	}

	function quantificar(tecla) {
		for (var i = 0, len = $scope.eventos.length; i < len; i += 1) {
			if ($scope.eventos[i].tempo) {
				if ($scope.eventos[i].config.tecla === tecla) {
					$scope.eventos[i].config.inicio = new Date();
				} else if ($scope.eventos[i].config.teclaFim === tecla && $scope.eventos[i].config.inicio !== 0) {
					$scope.eventos[i].config.duracao += (new Date() - $scope.eventos[i].config.inicio) / 1000;
					$scope.eventos[i].config.inicio = 0;
				}
			} else {
				if($scope.eventos[i].config.tecla === tecla) {
					$scope.eventos[i].config.contador += 1;
				}
			}
		}
	}

	function adicionar() {
		$scope.eventos.push(new Evento());
	}

	init();
}
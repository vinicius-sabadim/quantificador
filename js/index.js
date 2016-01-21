(function() {

	angular
		.module('app')
		.controller('PrincipalController', PrincipalController);

	PrincipalController.$inject = ['$scope'];

	function PrincipalController($scope) {

		$scope.tratarTecla = tratarTecla;
		$scope.adicionar = adicionar;
		$scope.toggleBotao = toggleBotao;
		$scope.toggleHistorico = toggleHistorico;

		function init() {
			$scope.textoBotao = 'Ocultar';

			$scope.mostrarTela = false;

			$scope.mostrarHistorico = false;
			$scope.historico = [];

			$scope.eventos = [new Evento('Tempo', 'Q', 'W'), new Evento('Contador', 'A')];
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

		function Historico(nome, tipo, posicao, iniciou) {
			iniciou = iniciou || null;

			this.nome = nome;
			this.tipo = tipo;
			this.posicao = formatarHorario(posicao);
			this.iniciou = iniciou;
			if (tipo === 'tempo') {
				this.icone = iniciou ? 'fa-play' : 'fa-stop';
			} else {
				this.icone = 'fa-plus'
			}
			return this;
		}

		function formatarHorario(posicao) {

			if (posicao === 0) {
				return '0:00';
			}

			posicao = (posicao / 60).toFixed(3);
			posicao = String(posicao);
			tempo = (posicao.split('.'));
			minutos = tempo[0];
			segundos = tempo[1];
			segundos = parseInt(segundos);
			segundos = (segundos * 60) / 1000;
			segundos = Math.round(segundos);

			if (segundos < 10) {
				segundos = '0' + segundos;
			}

			return minutos + ':' + segundos;
		}

		function toggleBotao() {
			$scope.mostrarTela = !$scope.mostrarTela;
			$scope.mostrarTela ? $scope.textoBotao = 'Mostrar' : $scope.textoBotao = 'Ocultar';
		}

		function toggleHistorico() {
			$scope.mostrarHistorico = !$scope.mostrarHistorico;
		}

		function tratarTecla(keyEvent) {
			quantificar(String.fromCharCode(keyEvent.keyCode));
		}

		function quantificar(tecla) {
			var inicio,
				primeiraTecla,
				segundaTecla,
				nome,
				posicao = document.getElementById('video').currentTime;

			if ($scope.mostrarTela) {
				for (var i = 0, len = $scope.eventos.length; i < len; i += 1) {
					nome = $scope.eventos[i].nome;

					if ($scope.eventos[i].tempo) {
						inicio = $scope.eventos[i].config.inicio;
						primeiraTecla = $scope.eventos[i].config.tecla;
						segundaTecla = $scope.eventos[i].config.teclaFim;

						if ((primeiraTecla === tecla) && (inicio === 0)) {
							$scope.eventos[i].config.inicio = new Date();
							$scope.historico.push(new Historico(nome, 'tempo', posicao, true));
						} else if ((segundaTecla === tecla) && (inicio !== 0)) {
							$scope.eventos[i].config.duracao += (new Date() - $scope.eventos[i].config.inicio) / 1000;
							$scope.eventos[i].config.inicio = 0;
							$scope.historico.push(new Historico(nome, 'tempo', posicao, false));
						}
					} else {
						if ($scope.eventos[i].config.tecla === tecla) {
							$scope.eventos[i].config.contador += 1;
							$scope.historico.push(new Historico(nome, 'contador', posicao));
						}
					}
				}
			}
		}

		function adicionar() {
			$scope.eventos.push(new Evento());
		}

		init();
	}

}());

(function() {
	$("#menu-toggle").click(function(e) {
		e.preventDefault();
		$("#wrapper").toggleClass("toggled");
	});
}());

(function localFileVideoPlayerInit(win) {
	$('#file-selected').val('');
	var URL = win.URL || win.webkitURL;

	var playSelectedFile = function playSelectedFileInit(event) {
		var file = this.files[0];
		var type = file.type;
		var videoNode = document.querySelector('video');
		var fileURL = URL.createObjectURL(file);
		videoNode.src = fileURL;
		$('#file-selected').val(file.name);
	};

	var inputNode = document.getElementById('file');
	inputNode.addEventListener('change', playSelectedFile, false);
}(window));

(function() {
	$(document).on('change', '.btn-file :file', function() {
		var input = $(this),
			numFiles = input.get(0).files ? input.get(0).files.length : 1,
			label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
		input.trigger('fileselect', [numFiles, label]);
	});
}());
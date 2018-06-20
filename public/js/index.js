(function() {

	angular
		.module('app')
		.controller('PrincipalController', PrincipalController)

	PrincipalController.$inject = ['$scope'];

	function PrincipalController($scope) {

		const Evento = {
			tempo: false,
			contador: 0,
			inicio: 0,
			duracao: 0,
			tecla: '',
			teclaFim: ''
		}

		const formatarHorario = (posicao) => {

			if (posicao === 0) {
				return '0:00'
			}

			posicao = (posicao / 60).toFixed(3)
			posicao = String(posicao)
			tempo = (posicao.split('.'))
			minutos = tempo[0]
			segundos = tempo[1]
			segundos = parseInt(segundos)
			segundos = (segundos * 60) / 1000
			segundos = Math.round(segundos)

			if (segundos < 10) {
				segundos = '0' + segundos
			}

			return minutos + ':' + segundos
		}

		const toggleBotao = () => {
			const { mostrarTela } = $scope
			$scope.mostrarTela = !mostrarTela
			$scope.textoBotao = !mostrarTela ? 'Mostrar as configurações' : 'Ocultar'
		}

		const toggleHistorico = () => {
			$scope.mostrarHistorico = !$scope.mostrarHistorico
		}

		const tratarTecla = (keyEvent) => {
			const { keyCode } = keyEvent
			if (keyCode >= 65 && keyCode <= 90) {
				quantificar(String.fromCharCode(keyCode))
			}
		}

		const quantificar = (tecla) => {
			let item = getItem(tecla)

			if (item.length === 0) return
			if (!$scope.mostrarTela) return

			item = item[0]

			const { nome, tempo } = item
			// const posicao = document.getElementById('video').currentTime

			if (tempo) {
				const primeiraTecla = item.tecla.toUpperCase()
				const segundaTecla = item.teclaFim.toUpperCase()

				if ((primeiraTecla === tecla) && (item.inicio === 0)) {
					item.inicio = new Date()
					$scope.historico.push({
						nome,
						// posicao,
						icone: 'fa-play'
					})
				} else if ((segundaTecla === tecla) && (item.inicio !== 0)) {
					item.duracao += (new Date() - item.inicio) / 1000
					item.inicio = 0
					$scope.historico.push({
						nome,
						// posicao,
						icone: 'fa-stop'
					})
				}
			} else {
				item.contador += 1
				$scope.historico.push({
					nome,
					icone: 'fa-plus'
				})
			}
		}

		const getItem = (tecla) => {
			return $scope.eventos.filter((item) => {
				return item.tecla.toUpperCase() === tecla || item.teclaFim.toUpperCase() === tecla
			})
		}

		const adicionar = () => {
			$scope.eventos.push({
				...Evento,
				nome: 'Novo evento'
			})
		}

		const salvar = () => {
			const eventos = JSON.stringify($scope.eventos)
			window.localStorage.setItem('eventos', eventos)
		}

		const limpar = () => {
			window.localStorage.clear()
		}

		const limparHistorico = () => {
			$scope.historico = []
			$scope.eventos.forEach((item) => {
				item.contador = 0
				item.duracao = 0
			})
		}

		$scope.tratarTecla = tratarTecla
		$scope.adicionar = adicionar
		$scope.salvar = salvar
		$scope.limpar = limpar
		$scope.limparHistorico = limparHistorico
		$scope.toggleBotao = toggleBotao
		$scope.toggleHistorico = toggleHistorico

		const init = () => {
			$scope.textoBotao = 'Ocultar'
			$scope.mostrarTela = false
			$scope.mostrarHistorico = false
			$scope.historico = []
			const eventos = JSON.parse(window.localStorage.getItem('eventos'))
			$scope.eventos = eventos || []
		}

		init()
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
(function() {
	angular
		.module('app')
		.controller('MainController', MainController)

	MainController.$inject = ['$scope']

	function MainController($scope) {
		const defaultEvent = {
			count: 0,
			duration: 0,
			endKey: '',
			key: '',
			name: '',
			start: 0,
			time: false
		}

		const toggleStartQuantify = () => {
			const { isQuantifying } = $scope
			$scope.isQuantifying = !isQuantifying
			$scope.quantifyButtonText = isQuantifying ? 'Start to quantify' : 'Stop to quantify'
		}

		const handleKey = (keyEvent) => {
			if (!$scope.isQuantifying) return false

			const { keyCode } = keyEvent
			if (keyCode >= 65 && keyCode <= 90) {
				includeNewInteraction(String.fromCharCode(keyCode))
			}
		}

		const includeNewInteraction = (key) => {
			const item = getEvent(key)
			if (!item) return

			const { name, time } = item

			if (!time) return item.count = item.count + 1

			const firstKey = item.key.toUpperCase()
			const secondKey = item.endKey.toUpperCase()
			if ((firstKey === key) && (item.start === 0)) {
				item.start = new Date()
			} else if ((secondKey === key) && (item.start !== 0)) {
				item.duration += (new Date() - item.start) / 1000
				item.start = 0
			}
		}

		const getEvent = (key) => {
			const found = $scope.events.filter((item) => {
				return item.key.toUpperCase() === key || item.endKey.toUpperCase() === key
			})
			return found.length > 0 ? found[0] : null
		}

		const addEvent = () => {
			$scope.events.push(defaultEvent)
		}

		const saveEvents = () => {
			const events = JSON.stringify($scope.events)
			window.localStorage.setItem('events', events)
		}

		const clearEvents = () => {
			window.localStorage.clear()
		}

		$scope.handleKey = handleKey
		$scope.toggleStartQuantify = toggleStartQuantify

		$scope.addEvent = addEvent
		$scope.saveEvents = saveEvents
		$scope.clearEvents = clearEvents
		
		const init = () => {
			$scope.quantifyButtonText = 'Start to quantify'

			// Check localstorage
			const events = JSON.parse(window.localStorage.getItem('events'))
			$scope.events = events || []
		}

		init()
	}

}())
import { mapListToDOMElements } from './DOMIntegration.js'


class TvApp {
  constructor() {
    this.viewElems = {}
    this.showNameButtons = {}
    this.selectedName = 'harry'
    this.initializeApp()
  }

  initializeApp = () => {
    this.connectDOMElements()
    this.setupListeners()
  }

  connectDOMElements = () => {
    const listOfIds = Array.from(document.querySelectorAll('[id]')).map(elem => (elem.id))
    const listOfshowNames = Array.from(
      document.querySelectorAll('[data-show-name]')
      ).map(elem => (elem.dataset.showName))

      this.viewElems = mapListToDOMElements(listOfIds, 'id')
      this.showNameButtons = mapListToDOMElements(listOfshowNames, 'data-show-name')
  }

  setupListeners = () => {
    Object.keys(this.showNameButtons).forEach(showName => {
      this.showNameButtons[showName].addEventListener('click', this.setCurrentName)
    })
  }

  setCurrentName = event => {
    this.selectedName = event.target.dataset.showName
  }

}

document.addEventListener('DOMContentLoaded', new TvApp())
import { mapListToDOMElements, createDOMElement } from './DOMIntegration.js'
import { getShowsByKey } from './requests.js'


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
    this.fetchAndDisplayShows()
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
    this.fetchAndDisplayShows()
  }

  fetchAndDisplayShows = () => {
    getShowsByKey(this.selectedName).then(shows => this.renderCards(shows))
  }

  renderCards = shows => {
    this.viewElems.showsWrapper.innerHTML = ""

   for (const { show } of shows) {
     this.createShowCard(show)
   }
  }

  createShowCard = show => {
    const divCard = createDOMElement('div', 'card')
    const cardBodyDiv = createDOMElement('div', 'card-body')
    const h5 = createDOMElement('h5', 'card-title', show.name)
    const btn = createDOMElement('button', 'btn btn-primary', 'Show details')
    let img, paragraph

    show.image ? 
    img = createDOMElement('img', 'card-img-top', null, show.image.medium) 
    : img = createDOMElement('img', 'card-img-top', null, 'https://via.placeholder.com/250x350')

    show.summary ? 
    paragraph = createDOMElement('p', 'card-text', `${show.summary.replace(/<[^>]*>?/gm, '').slice(0, 100)}...`) 
    : paragraph = createDOMElement('p', 'card-text', 'There is no summary for this show')


    divCard.appendChild(img)
    divCard.appendChild(cardBodyDiv)
    cardBodyDiv.appendChild(h5)
    cardBodyDiv.appendChild(paragraph)
    cardBodyDiv.appendChild(btn)

    this.viewElems.showsWrapper.appendChild(divCard)
  }

}

document.addEventListener('DOMContentLoaded', new TvApp())
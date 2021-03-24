import { mapListToDOMElements, createDOMElement } from './DOMIntegration.js'
import { getShowsByKey, getShowsByID } from './requests.js'


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
    getShowsByKey(this.selectedName).then(shows => this.renderCardsOnList(shows))
  }

  renderCardsOnList = shows => {
    this.viewElems.showsWrapper.innerHTML = ""
    Array.from(document.querySelectorAll('[data-show-id]')
    ).forEach(btn => {
      btn.removeEventListener('click', this.openDetailsView)
    })

   for (const { show } of shows) {
     const card = this.createShowCard(show)
     this.viewElems.showsWrapper.appendChild(card)
   }
  }

  openDetailsView = event => {
    const { showId } = event.target.dataset
    getShowsByID(showId).then(show => {
      const card = this.createShowCard(show, true)
      this.viewElems.showPreview.appendChild(card)
      this.viewElems.showPreview.style.display = 'flex'
    })
  }

  closeDetailsView = event => {
    const { showId } = event.target.dataset
    const closeBtn = document.querySelector(`[id="showPreview"] [data-show-id="${showId}"]`)
    closeBtn.removeEventListener('click', this.closeDetailsView)
    this.viewElems.showPreview.style.display = 'none'
    this.viewElems.showPreview.innerHTML = ''
  }

  createShowCard = (show, isDetailed )=> {
    const divCard = createDOMElement('div', 'card')
    const cardBodyDiv = createDOMElement('div', 'card-body')
    const h5 = createDOMElement('h5', 'card-title', show.name)
    const btn = createDOMElement('button', 'btn btn-primary', 'Show details')
    let img, paragraph

    if (show.image) {
      if (isDetailed) {
        img = createDOMElement('div', 'card-preview-bg') 
        img.style.backgroundImage = `url('${show.image.original}')`
      } else {
        img = createDOMElement('img', 'card-img-top', null, show.image.medium) 
    }} else {
      img = createDOMElement('img', 'card-img-top', null, 'https://via.placeholder.com/250x350')
    }

    if (show.summary) {
      if (isDetailed) {
        paragraph = createDOMElement('p', 'card-text', show.summary.replace(/<[^>]*>?/gm, '')) 
      } else {
        paragraph = createDOMElement('p', 'card-text', `${show.summary.replace(/<[^>]*>?/gm, '').slice(0, 100)}...`) 
      }} else {
      paragraph = createDOMElement('p', 'card-text', 'There is no summary for this show')
    }

    btn.dataset.showId = show.id

    if (isDetailed) {
      btn.addEventListener('click', this.closeDetailsView)
    } else {
      btn.addEventListener('click', this.openDetailsView)
    }

    divCard.appendChild(img)
    divCard.appendChild(cardBodyDiv)
    cardBodyDiv.appendChild(h5)
    cardBodyDiv.appendChild(paragraph)
    cardBodyDiv.appendChild(btn)

    return divCard
  }

}

document.addEventListener('DOMContentLoaded', new TvApp())
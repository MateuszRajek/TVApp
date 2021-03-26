import { mapListToDOMElements, createDOMElement } from './DOMIntegration.js'
import { getShowsByKey, getShowsByID } from './requests.js'


class TvApp {
  constructor() {
    this.viewElems = {}
    this.selectedName = 'show'
    this.initializeApp()
  }

  initializeApp = () => {
    this.connectDOMElements()
    this.setupListeners()
    this.fetchAndDisplayShows()
  }

  connectDOMElements = () => {
    const listOfIds = Array.from(document.querySelectorAll('[id]')).map(elem => (elem.id))
      this.viewElems = mapListToDOMElements(listOfIds, 'id')
  }

  setupListeners = () => {
    this.viewElems.searchInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        this.fetchAndDisplayShows()
    }})
    this.viewElems.searchInput.addEventListener('input', this.setCurrentName)
    this.viewElems.searchForShowsBtn.addEventListener('click', this.fetchAndDisplayShows)
  }

  setCurrentName = event => {
    this.selectedName = event.target.value
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
      this.viewElems.showsCover.style.display = 'block'
      document.body.style.overflow = 'hidden'
    })
  }

  closeDetailsView = event => {
    const { showId } = event.target.dataset
    const closeBtn = document.querySelector(`[id="showPreview"] [data-show-id="${showId}"]`)
    closeBtn.removeEventListener('click', this.closeDetailsView)
    this.viewElems.showPreview.style.display = 'none'
    this.viewElems.showPreview.innerHTML = ''
    this.viewElems.showsCover.style.display = 'none'
    document.body.style.overflow = 'visible'
  }

  createShowCard = (show, isDetailed )=> {
    const divCard = createDOMElement('div', 'card')
    const cardBodyDiv = createDOMElement('div', 'card-body')
    const h5 = createDOMElement('h5', 'card-title', show.name)
    const cardTextWrapper = createDOMElement('div', 'card-text-wrapper')
    let img, paragraph, btn

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

    if (isDetailed) {
      btn = createDOMElement('button', 'btn btn-warning', 'Close details view')
    } else {
      btn = createDOMElement('button', 'btn btn-primary', 'Show details')
    }

    btn.dataset.showId = show.id

    if (isDetailed) {
      btn.addEventListener('click', this.closeDetailsView)
    } else {
      btn.addEventListener('click', this.openDetailsView)
    }

    divCard.appendChild(img)
    divCard.appendChild(cardBodyDiv)
    cardBodyDiv.appendChild(cardTextWrapper)
    cardTextWrapper.appendChild(h5)
    cardTextWrapper.appendChild(paragraph)
    cardBodyDiv.appendChild(btn)

    return divCard
  }
}

document.addEventListener('DOMContentLoaded', new TvApp())
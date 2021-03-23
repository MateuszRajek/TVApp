const _getDOMElements = (attribute, value) => {
  return document.querySelector(`[${attribute}="${value}"]`)
}

export const mapListToDOMElements = (listOfValues, attribute) => {

  const _viewElements = {};

  for (const value of listOfValues) {
    _viewElements[value] = _getDOMElements(attribute, value)
  }

  return _viewElements;
}

export const createDOMElement = (tagName, className, innerText, src) => {
  const tag = document.createElement(tagName)
  tag.className = className
  
  if (innerText) tag.innerText = innerText
  if (src) tag.src = src

  return tag
}
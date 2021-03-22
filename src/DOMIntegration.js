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
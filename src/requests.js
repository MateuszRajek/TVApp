export const getShowsByKey = key => {
return fetch(`http://api.tvmaze.com/search/shows?q=${key}`).then(resp => resp.json())
}

export const getShowsByID = id => {
  return fetch(`http://api.tvmaze.com/shows/${id}?embed=cast`).then(resp => resp.json())
}
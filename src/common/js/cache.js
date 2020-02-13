import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 100

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 1000

function insertArray (arr, val, compare, maxLen) {
  let index = arr.findIndex(compare)
  if (index === 0) {
    return
  } else if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteOneArray (arr, compare) {
  let index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function deleteSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteOneArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch () {
  let searches = []
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function savePlay(song) {
  let playSearch = storage.get(PLAY_KEY, [])
  insertArray(playSearch, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, playSearch)
  return playSearch
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

export function saveFavorite(song) {
  let favoriteList = storage.get(FAVORITE_KEY, [])
  insertArray(favoriteList, song, (item) => {
    return item.id === song.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, favoriteList)
  return favoriteList
}

export function deleteFavorite(song) {
  let favoriteList = storage.get(FAVORITE_KEY, [])
  deleteOneArray(favoriteList, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, favoriteList)
  return favoriteList
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}

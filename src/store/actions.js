import * as types from './mutation-types'
import { shuffle } from 'common/js/util'
import { playMode } from 'common/js/config'
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite } from 'common/js/cache'

function findIndex(list, target) {
  let index = list.findIndex((item) => {
    return item.id === target.id
  })
  return index
}
export const selectPlay = function ({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({ commit }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.random)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function ({ commit, state }, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequencelist.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let index = findIndex(playlist, song)
  currentIndex++
  playlist.splice(currentIndex, 0, song)
  // 如果待插入的歌存在于当前列表
  if (index > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > index) {
      playlist.splice(index, 1)
      currentIndex--
    } else {
      playlist.splice(index + 1, 1)
    }
  }
  // 获得要sequenceList中插入的索引
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  sequenceList.splice(currentSIndex, 0, song)
  let fsIndex = findIndex(sequenceList, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const clearSonglist = function({ commit }) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export const deleteSong = function({ commit, state }, song) {
  let sequencelist = state.sequencelist.slice()
  let playlist = state.playlist.slice()
  // 当前播放的歌的索引
  let currentIndex = state.currentIndex
  // 被删掉的歌的索引
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  if (pIndex < currentIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  let sIndex = findIndex(sequencelist, song)
  sequencelist.splice(sIndex, 1)

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequencelist)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
}

export const savePlayHistory = function({ commit }, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavoriteSong = function({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteSong = function({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}

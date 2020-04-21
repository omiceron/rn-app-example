import { toJS } from 'mobx'
import { SHORT_DATE_FORMAT, DATE_FORMAT, LOCALE, TIME_FORMAT } from '../constants'
import * as FileSystem from 'expo-file-system'
import path from 'path'

export function entitiesFromFB(data) {
  Object.entries(data).forEach(([key, value]) => (value.uid = key))
  return data
}

// TODO: Rename 'user' to 'userId'
export function messagesFromFirebase(data) {
  return Object.entries(data).map(([key, value]) => ({ ...value, key, userId: value.user }))
}

export function randomId() {
  return (Date.now() + Math.random()).toString()
}

export function isPropsDiffer(props, nextProps) {
  const unobservableProps = toJS(props)
  const unobservableNextProps = toJS(nextProps)

  for (const key in unobservableNextProps) {
    if (unobservableNextProps.hasOwnProperty(key) && unobservableNextProps[key] !== unobservableProps[key]) {
      return true
    }
  }
  return false
}

export function getDate(timestamp, options = {}) {
  return new Date(timestamp).toLocaleDateString(LOCALE, options.short ? SHORT_DATE_FORMAT : DATE_FORMAT)
}

export function getTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString(LOCALE, TIME_FORMAT)
}

export function urlToBlob(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onerror = reject
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve(xhr.response)
      }
    }
    xhr.open('GET', url)
    xhr.responseType = 'blob'
    xhr.send()
  })
}

export function alphabetic(p, options = {}) {
  if (typeof p === 'string') p = [p]
  const deep = (obj) => p.reduce((acc, c) => (acc ? acc[c] : undefined), obj)
  return (a, b) => {
    a = deep(a)
    b = deep(b)
    if (a === undefined && b === undefined) return 0

    return a > b ? (a === b ? 0 : 1) : -1
  }
}

export async function copyFile(from, to) {
  const targetDirectory = path.dirname(to)

  const { isDirectory } = await FileSystem.getInfoAsync(targetDirectory).catch(console.warn)

  if (!isDirectory) await FileSystem.makeDirectoryAsync(targetDirectory, { intermediates: true }).catch(console.warn)

  return await FileSystem.copyAsync({ from, to }).catch(console.warn)
}

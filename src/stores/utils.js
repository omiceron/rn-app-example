import {toJS} from 'mobx'
import {DATE_FORMAT, LOCALE, TIME_FORMAT} from '../constants'

export function entitiesFromFB(data) {
  Object.entries(data).forEach(([key, value]) => value.uid = key)
  return data
}

// TODO: Rename 'user' to 'userId'
export function messagesFromFirebase(data) {
  return Object
    .entries(data)
    .map(([key, value]) => ({...value, key, userId: value.user}))
}

export function randomId() {
  return (Date.now() + Math.random()).toString()
}

export function isPropsDiffer(props, nextProps) {
  const unobservableProps = toJS(props)
  const unobservableNextProps = toJS(nextProps)

  for (const key in unobservableNextProps) {
    if (unobservableNextProps.hasOwnProperty(key) &&
      unobservableNextProps[key] !== unobservableProps[key]
    ) {
      return true
    }
  }
  return false
}

export function getDate(timestamp) {
  return new Date(timestamp).toLocaleDateString(LOCALE, DATE_FORMAT)
}

export function getTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString(LOCALE, TIME_FORMAT)
}
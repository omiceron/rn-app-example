import {toJS} from 'mobx'

export function entitiesFromFB(data) {
  Object.entries(data).forEach(([key, value]) => value.uid = key)
  return data
}

export function messagesFromFirebase(data) {
  return Object
    .entries(data)
    .map(([key, value]) => ({...value, _id: key, key, user: {_id: value.user}}))
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
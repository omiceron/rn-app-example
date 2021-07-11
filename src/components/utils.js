import dictionary from './dictionary'

export const translate = (key) => dictionary[key]
export const getFullName = ({firstName, lastName}) => `${firstName} ${lastName}`

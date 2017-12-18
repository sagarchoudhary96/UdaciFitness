import { AsyncStorage }  from 'react-native'
import { CALENDAR_STORAGE_KEY, formatCalendarResults } from './calender'

export const submitEntry = ({key, entry }) =>{
  return AsyncStorage.mergeItem(CALENDAR_STORAGE_KEY, JSON.stringify({
    [key]: entry,
  }))
}

export const removeEntry = (key) => {
  return AsyncStorage.getItem(CALENDAR_STORAGE_KEY)
    .then((result)=> {
      const data = JSON.parse(result)
      data[key] = undefined
      delete data[key]
      AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(data))
    })
}

export const fetchCalendarResults = () => {
  return AsyncStorage.getItem(CALENDAR_STORAGE_KEY)
    .then(formatCalendarResults)
}

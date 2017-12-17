export const RECEIVE_ENTERIES = 'RECEIVE_ENTERIES'
export const ADD_ENTRY = 'AddEntry'

export const receiveEntries = (entries) => ({
  type: ADD_ENTRY,
  entries
})


export const addEntry = (entry) => ({
  type: ADD_ENTRY,
  entry
}) 

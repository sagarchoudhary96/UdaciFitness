import { RECEIVE_ENTERIES, ADD_ENTRY } from '../actions'


export default entries = (state= {}, action) => {
  switch(action.type) {
    case RECEIVE_ENTERIES:
      return {
        ...state,
        ...action.entries
      }
    case ADD_ENTRY:
      return {
        ...state,
        ...action.entry
      }
    default:
      return state
  }
}

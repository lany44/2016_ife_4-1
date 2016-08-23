import * as Types from "../constants/CalendarActionTypes"

const initialState = {
    visible: false,
    tdType: "day",
    startTime: new Date(),
    selectedDay: '',
    duration: '300'
}


const calendar = (state = initialState, action) => {
  switch(action.type) {
    case Types.SHOW_CALENDAR:
      return Object.assign({}, state, { visible: true })
    case Types.HIDE_CALENDAR:
      return Object.assign({}, state, { visible: false })
    case Types.CHANGE_TD_TYPE:
      return Object.assign({}, state, { tdType: action.newtype})
    case Types.CHANGE_START_TIME:
      return Object.assign({}, state, { startTime: action.newTime })
    case Types.SELECT_DAY:
      return Object.assign({}, state, { selectedDay: action.selectedDay })
    default:
      return state;
  }
}

export default calendar

import * as Types from "../constants/CalendarActionTypes"

const CalendarActions = {
  showCalendar() {
    return { type: Types.SHOW_CALENDAR, }
  },
  hideCalendar() {
    return { type: Types.HIDE_CALENDAR }
  },
  changeTdtype(newtype) {
    return { type: Types.CHANGE_TD_TYPE, newtype}
  },
  changeStartTime(newTime) {
    return { type: Types.CHANGE_START_TIME, newTime }
  },
  selectDay(selectedDay) {
    return { type: Types.SELECT_DAY, selectedDay }
  }
};

export default CalendarActions

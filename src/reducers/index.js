import { combineReducers } from "redux"
import { routerReducer as routing } from "react-router-redux"
import dialog from "./DialogReducer"
import calendar from "./CalendarReducer"
import questionnaires from "./QuestionnairesReducer"

const rootReducer = combineReducers({
  routing,
  dialog,
  calendar,
  questionnaires,
})

export default rootReducer

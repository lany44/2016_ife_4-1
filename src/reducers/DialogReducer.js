import * as Types from "../constants/DialogActionTypes"

const initialState = {
    title: null,
    information: null,
    onConfirm: null,
    onCancel: null
}

const dialog = (state = initialState, action) => {
  switch(action.type) {
    case Types.SHOW_DIALOG: {
      let info = action.info
      return Object.assign({}, state, { title: info.title, information: info.information, onConfirm: info.onConfirm ? info.onConfirm : null, onCancel: info.onCancel ? info.onCancel : null })
    }
    default:
      return state;
  }
}

export default dialog

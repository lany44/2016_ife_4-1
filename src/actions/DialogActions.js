import * as Types from "../constants/DialogActionTypes"

const DialogActions = {
  showDialog(info) {
    return { type: Types.SHOW_DIALOG, info }
  },
};

export default DialogActions

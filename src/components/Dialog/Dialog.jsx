import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import styles from "./Dialog.scss";

class Dialog extends Component{
  static PropTypes = {
    dialog: PropTypes.shape({
      title: PropTypes.string.isRequired,
      information: PropTypes.string.isRequired,
      onConfirm: PropTypes.func,
      onCancel: PropTypes.func
    }).isRequired,
    className: PropTypes.string.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }
  handleOnConfirm() {
    const { onConfirm } = this.props.dialog
    onConfirm ? onConfirm() : null
    this.handleHide()
  }
  handleOnCancel() {
    const { onCancel } = this.props.dialog
    onCancel ? onCancel() : null
    this.handleHide()
  }
  handleShow() {
    this.setState({visible: true})
  }
  handleHide() {
    const { mask, dialog } = this.refs
    mask.className += ' '+styles["hide-mask"]
    dialog.className += ' '+styles["hide-dialog"]
    setTimeout(() => {this.setState({visible: false})}, 300)
  }
  render() {
    const { title, information, onCancel, onConfirm } = this.props.dialog
    return this.state.visible ? (
      <div className={"components-Dialog "} className={this.props.className}>
        {this.props.children}
        <div className = {styles.dialog} ref="dialog">
          <div className = {styles.header}>
            <span>{title}</span>
            <span
              className={styles.close}
              onClick={::this.handleHide}
            >
            </span>
          </div>
          <div className={styles.content}>
            {information}
          </div>
          <div className={styles.footer}>
            {onConfirm ?
              <span
                className={styles.btn}
                onClick={::this.handleOnConfirm}
              >
                确认
              </span>
              : null
            }
            <span
              className={styles.btn}
              onClick={::this.handleOnCancel}
            >
              取消
            </span>
          </div>
        </div>
        <div
          className={styles.mask}
          onClick={::this.handleHide}
          ref="mask"
        >
        </div>
      </div>
    ) : (
      <div
        className={"components-Dialog "}
        className={this.props.className}
        onClick={::this.handleShow}
      >
        {this.props.children}
      </div>
    )
  }
}

export default Dialog;

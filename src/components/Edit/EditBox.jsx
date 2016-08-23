import React, { PropTypes } from 'react'
import styles from './EditBox.scss'

class EditBox extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    content: PropTypes.string.isRequired,
    question: PropTypes.number.isRequired,
    option: PropTypes.number.isRequired,
    saveText: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      editing: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleSaveText = this.handleSaveText.bind(this)
  }
  componentDidUpdate() {
    if(this.state.editing) {
      const { input } = this.refs
      input.focus();
      input.select();
    }
  }
  handleClick() {
    this.setState({editing: true})
  }
  handleSaveText(event) {
    if(event.type === "keydown" && event.which === 13 || event.type === "blur") {
      const newText = this.refs.input.value
      const { question, option } = this.props
      this.props.saveText(question, option, newText)
      this.setState({editing: false})
    }
  }
  render() {
    const { content, className } = this.props
    return this.state.editing ? (
      <input
        type="text"
        ref="input"
        className={className}
        defaultValue={content}
        onChange={this.handleSaveText}
        onKeyDown={this.handleSaveText}
        onBlur={this.handleSaveText}
      />
    ) : (
      <p
        className={className}
        onClick={this.handleClick}
      >
        {content}
      </p>
    )
  }
}

export default EditBox

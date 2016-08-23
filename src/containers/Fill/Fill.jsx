import React, { Component, PropTypes } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { Link } from "react-router"
import classNames from "classnames"
import styles from "./Fill.scss"
import { Dialog } from "../../components"
import DialogActions from "../../actions/DialogActions"
import * as QuestionnairesActions from '../../actions/QuestionnairesActions'


const mapStateToProps = state => ({
  dialog: state.dialog,
  questionnaires: state.questionnaires
})

const mapDispatchToProps = dispatch => ({
  DialogActions: bindActionCreators(DialogActions, dispatch),
  QuestionnairesActions: bindActionCreators(QuestionnairesActions, dispatch),
})

@connect(mapStateToProps, mapDispatchToProps)
class Fill extends Component {
  constructor(props) {
    super(props)
    this.handleChooseOption = this.handleChooseOption.bind(this)
    this.handleFillText = this.handleFillText.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChooseOption(questionType, questionIndex, optionIndex) {
    const { chooseOption, toggleOption } = this.props.QuestionnairesActions
    return event => {
      switch (questionType) {
        case 'SC': chooseOption(questionIndex, optionIndex); break;
        case 'MC': toggleOption(questionIndex, optionIndex); break;
      }
    }
  }
  handleFillText(questionIndex) {
    const { fillText } = this.props.QuestionnairesActions
    return event => fillText(event.target.value, questionIndex)
  }
  handleSubmit() {
    const { QuestionnairesActions: { submitQuestionnaire }, DialogActions: { showDialog } } = this.props
    const history = this.props.history
    if(this.isFilled()) {
      const dialog = {
        title: '提示：',
        information: '确认提交问卷吗？',
        onConfirm: () => {
          submitQuestionnaire()
          setTimeout(history.goBack, 300)
        }
      }
      showDialog(dialog)
    }else {
      const dialog = {
        title: '错误：',
        information: '请完整完成问卷！'
      }
      showDialog(dialog)
    }
  }
  isFilled() {
    const { questionnaires: { list, editing: { id, data } } } = this.props
    return data.every((datum, questionIndex) => {
      const question = list[id].questions[questionIndex]
      switch(question.type) {
        case 'SC': return datum ^ -1
        case 'MC': return datum.length
        case 'TX': return !question.isRequiered || datum !== ''
      }
    })
  }
  render() {
    const { dialog } = this.props
    const { id, data } = this.props.questionnaires.editing
    const { title, questions } = this.props.questionnaires.list[id]
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {title}
          </h1>
        </div>
        <hr className={styles.line}></hr>
        <div className={styles.list}>
          {questions.map((question, questionIndex) =>
            <div
              key={questionIndex}
              className={styles.question}
            >
              <div className={styles["question-caption"]}>
                <span>{`Q${questionIndex + 1}`}</span>
                <span
                  className={styles["question-content"]}
                >
                  {question.content}
                </span>
              </div>
              {question.type !== 'TX' ? (
                <div className={styles.options}>
                  {question.options.map((option, optionIndex) =>
                    <div
                      key={optionIndex}
                      className={styles.option}
                      onClick={this.handleChooseOption(question.type, questionIndex, optionIndex)}
                    >
                      <span
                        className={classNames({
                          [styles["SC-option-icon"]]: question.type === "SC",
                          [styles["SC-option-icon-selected"]]:
                            question.type === "SC" && data[questionIndex] == optionIndex,
                          [styles["MC-option-icon"]]: question.type === "MC",
                          [styles["MC-option-icon-selected"]]:
                            question.type === "MC" && data[questionIndex].includes(optionIndex)
                        })}
                      />
                      <span
                        className={styles["option-content"]}
                      >
                        {option}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.options}>
                  <textarea
                    className={styles["TX-textarea"]}
                    value={data[questionIndex]}
                    onChange={this.handleFillText(questionIndex)}
                  >
                  </textarea>
                  { question.isRequiered ? <p>此题必填！</p> : "" }
                </div>
              )}
            </div>
          )}
        </div>
        <hr className={styles.line}></hr>
        <div className={styles.footer}>
          <Dialog dialog={dialog}>
            <span
              className={styles.button}
              onClick={this.handleSubmit}
            >
              提交问卷
            </span>
          </Dialog>
          <Link to='/'>
            <span
              className={styles.button}
            >
              返回
            </span>
          </Link>
        </div>
      </div>
    )
  }
}

export default Fill

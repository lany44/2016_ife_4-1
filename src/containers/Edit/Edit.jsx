import React, { Component, PropTypes } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { Link } from "react-router"
import styles from "./Edit.scss"
import classNames from "classnames"
import { Dialog, Calendar, EditBox } from "../../components"
import DialogActions from "../../actions/DialogActions"
import CalendarActions from "../../actions/CalendarActions"
import * as QuestionnairesActions from "../../actions/QuestionnairesActions"
import { UN_RELEASED, ON_RELEASED, OVER_RELEASE } from "../../constants/QuestionnairesStatus"

const testOptions = (props, propsName, componentName) => {
  if(props.type !== 'TX'
     && !(props.options && isArray(props.options) && props.options.every(option => typeof option === 'string')))
    return new Error(`Invalid prop '${propsName}' supplied to ${componentName}. Validation failed`)
}


const mapStateToProps = state => ({
  dialog: state.dialog,
  calendar: state.calendar,
  questionnaires: state.questionnaires
})

const mapDispatchToProps = dispatch => ({
  DialogActions: bindActionCreators(DialogActions, dispatch),
  CalendarActions: bindActionCreators(CalendarActions, dispatch),
  QuestionnairesActions: bindActionCreators(QuestionnairesActions, dispatch)
})

@connect(mapStateToProps, mapDispatchToProps)
class Edit extends Component {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    const { deadline } = this.props.questionnaires.editing
    const { selectDay } = this.props.CalendarActions
    selectDay(deadline)
  }
  handleAddQuestion(event) {
    const { addQuestion } = this.props.QuestionnairesActions
    const questionTypes = ['SC', 'MC', 'TX']
    questionTypes.forEach(element => event.target === this.refs[element] && addQuestion(element))
  }
  handleRemoveQuestion(questionIndex) {
    const { removeQuestion } = this.props.QuestionnairesActions
    return event => removeQuestion(questionIndex)
  }
  handleReuseQuestion(questionIndex) {
    const { reuseQuestion } = this.props.QuestionnairesActions
    return event => reuseQuestion(questionIndex)
  }
  handleShiftQuestion(questionIndex, direction) {
    const { shiftQuestion } = this.props.QuestionnairesActions
    return event => shiftQuestion(questionIndex, direction)
  }
  handleToggleRequirement(questionIndex) {
    const { toggleRequirement } = this.props.QuestionnairesActions
    return event => toggleRequirement(questionIndex)
  }
  handleAddOption(questionIndex) {
    const { addOption } = this.props.QuestionnairesActions
    return event => addOption(questionIndex)
  }
  handleRemoveOption(questionIndex, optionIndex) {
    const { removeOption } = this.props.QuestionnairesActions
    return event => removeOption(questionIndex, optionIndex)
  }
  handleSaveQuestionnaire() {
    const { saveQuestionnaire } = this.props.QuestionnairesActions
    const { showDialog } = this.props.DialogActions
    const { id } = this.props.questionnaires.editing
    const { selectedDay } = this.props.calendar
    const promptDialog = {
      title: "提示",
      information: "保存成功！"
    }
    saveQuestionnaire(id, selectedDay)
    showDialog(promptDialog)
  }
  isLegal() {
    const { questionnaires: { editing: { title, questions } }, calendar: { selectedDay } } = this.props
    return title && selectedDay && questions.length && questions.every(question =>
      question.content && question.type === 'TX' || question.options.length > 1 && question.options.every(option => option)
    )
  }
  handleReleaseQuestionnaire() {
    const { saveQuestionnaire, releaseQuestionnaire } = this.props.QuestionnairesActions
    const { showDialog } = this.props.DialogActions
    const { id } = this.props.questionnaires.editing
    const { selectedDay } = this.props.calendar
    const { history } = this.props
    if(selectedDay === '') {
      const errorDialog = {
        title: "错误！",
        information: "未选择截止日期！"
      }
      showDialog(errorDialog)
    }else if(!this.isLegal()) {
      const errorDialog = {
        title: "错误！",
        information: "问卷信息不合法！"
      }
      showDialog(errorDialog)
    } else {
      const promptDialog = {
        title: "提示",
        information: `问卷截止日期${selectedDay}`,
        onConfirm: () => {
          saveQuestionnaire(id, selectedDay)
          releaseQuestionnaire(id)
          setTimeout(history.goBack, 310)
        }
      }
      showDialog(promptDialog)
    }
  }
  renderQuestionType(question) {
    let typeString
    switch(question.type) {
      case "SC": typeString = "单选题"; break;
      case "MC": typeString = "多选题"; break;
      case "TX": typeString = "文本题"; break;
    }
    return <span>{typeString}</span>
  }
  renderQuestions() {
    const { questionnaires:{ editing }, QuestionnairesActions:{ saveText } } = this.props
    const last = editing.questions.length - 1
    return editing.questions.map((question, questionIndex) => (
      <div
        key={questionIndex}
        className={styles.question}
      >
        <div className={styles["question-caption"]}>
          <span>{`Q${questionIndex + 1}`}</span>
          <EditBox
            className={styles["question-content"]}
            content={question.content}
            question={questionIndex}
            option={-1}
            saveText={saveText}
          />
        </div>
        {question.type !== 'TX' ? (
          <div className={styles.options}>
            {
              question.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className={styles.option}
                >
                  <span
                    className={classNames({
                      [styles["SC-option-icon"]]: question.type === "SC",
                      [styles["MC-option-icon"]]: question.type === "MC"
                    })}
                  />
                  <EditBox
                    key={optionIndex}
                    className={styles["option-content"]}
                    content={option}
                    question={questionIndex}
                    option={optionIndex}
                    saveText={saveText}
                  />
                  <span
                    className={styles["remove-option-icon"]}
                    onClick={::this.handleRemoveOption(questionIndex, optionIndex)}
                  />
                </div>
              ))
            }
            <p
              className={classNames({
                [styles["option"]]: true,
                [styles["add-option"]]: true
              })}
              onClick={::this.handleAddOption(questionIndex)}
            >
              添加选项
            </p>
          </div>
        ) : (
          <div className={styles.options}>
            <textarea className={styles["TX-textarea"]}></textarea>
            <p>
              <span
                className={classNames({
                  [styles["TX-isRequiered-icon"]]: question.isRequiered,
                  [styles["TX-disRequiered-icon"]]: !question.isRequiered
                })}
                onClick={::this.handleToggleRequirement(questionIndex)}
              />
              此题是否必填
            </p>
          </div>
        )}
        <p
          className={classNames({
            [styles["operations-wrap"]]: true,
            [styles["option"]]: true
          })}
        >
          {questionIndex > 0 && (
              <span
                className={styles["operation"]}
                onClick={::this.handleShiftQuestion(questionIndex, -1)}
              >
                上移
              </span>
            )
          }
          {questionIndex < last && (
              <span
                className={styles["operation"]}
                onClick={::this.handleShiftQuestion(questionIndex, 1)}
              >
                下移
              </span>
            )
          }
          <span
            className={styles["operation"]}
            onClick={::this.handleReuseQuestion(questionIndex)}
          >
            复用
          </span>
          <span
            className={styles["operation"]}
            onClick={::this.handleRemoveQuestion(questionIndex)}
          >
            删除
          </span>
        </p>
      </div>
    ))
  }
  render() {
    const { calendar, dialog, questionnaires, DialogActions, CalendarActions, QuestionnairesActions } = this.props
    return (
      <div className={styles.container}>
        <div className="Edit-header-title" className={styles.header}>
          <EditBox
            className={styles.title}
            question={-1}
            option={-1}
            content={questionnaires.editing.title}
            saveText={QuestionnairesActions.saveText}
          />
        </div>
        <hr className={styles.line}></hr>
        <div className={styles.list}>
          {this.renderQuestions()}
        </div>
        <hr className={styles.line}></hr>
        <div className={styles.addQuestions}>
          <h2>添加新的问题</h2>
          <span
            ref="SC"
            className={styles.button}
            onClick={::this.handleAddQuestion}
          >
            <span className={styles["SC-btn-icon"]} />
            {"单选"}
          </span>
          <span
            ref="MC"
            className={styles.button}
            onClick={::this.handleAddQuestion}
          >
            <span className={styles["MC-btn-icon"]} />
            {"多选"}
          </span>
          <span
            ref="TX"
            className={styles.button}
            onClick={::this.handleAddQuestion}
          >
            <span className={styles["TX-btn-icon"]} />
            {"文本"}
          </span>
        </div>
        <hr className={styles.line}></hr>
        <div className={styles.footer}>
          <div className="Edit-footer-time">
            <span>问卷截至日期：</span>
            <Calendar calendar={calendar} {...CalendarActions} />
          </div>
          <div className="Edit-footer-button" className={styles.buttons}>
            <Dialog dialog={dialog}>
              <span
                className={styles.button}
                onClick={::this.handleSaveQuestionnaire}
              >
                保存问卷
              </span>
            </Dialog>
            <Dialog dialog={dialog}>
              <span
                className={styles.button}
                onClick={::this.handleReleaseQuestionnaire}
                >
                发布问卷
              </span>
            </Dialog>
          </div>
        </div>
      </div>
    )
  }
}

export default Edit

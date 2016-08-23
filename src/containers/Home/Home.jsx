import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router";
import classNames from "classnames";
import styles from "./Home.scss"
import { Dialog, Table, Column, SortTableTh } from "../../components"
import * as DialogActions from "../../actions/DialogActions"
import * as QuestionnairesActions from "../../actions/QuestionnairesActions"
import { UN_RELEASE, ON_RELEASE, OVER_RELEASE } from "../../constants/QuestionnairesStatus"

const mapStateToProps = state => ({
  dialog: state.dialog,
  questionnaires: state.questionnaires
});

const mapDispatchToProps = dispatch => ({
  DialogActions: bindActionCreators(DialogActions, dispatch),
  QuestionnairesActions: bindActionCreators(QuestionnairesActions, dispatch)
});

@connect(mapStateToProps, mapDispatchToProps)
class Home extends Component {
  constructor(props) {
    super(props)
    this.handleAddQuestionnaire = this.handleAddQuestionnaire.bind(this)
    this.handleRemoveQuestionnaire = this.handleRemoveQuestionnaire.bind(this)
    this.handleEditQuestionnaire = this.handleEditQuestionnaire.bind(this)
    this.handleFillQuestionnaire = this.handleFillQuestionnaire.bind(this)
    this.handleCheckData = this.handleCheckData.bind(this)
    this.handleSortQuestionnaire = this.handleSortQuestionnaire.bind(this)
  }
  componentWillMount() {
    const { questionnaires: { list }, QuestionnairesActions: { closeQuestionnaire }} = this.props
    const now = new Date()
    const [ year, month, day ] = [ now.getFullYear(), now.getMonth()+1, now.getDate() ]
    if(list.length > 0) {
      list.forEach((q, i) => {
        const t = q.deadline.split(' － ')
        if(year > t[0] || month > t[1] || day > t[2])
        closeQuestionnaire(i)
      })
    }
  }
  handleAddQuestionnaire() {
    const { addQuestionnaire } = this.props.QuestionnairesActions
    addQuestionnaire()
  }
  handleRemoveQuestionnaire(questionnaireIndex) {
    const { removeQuestionnaire } = this.props.QuestionnairesActions
    return event => removeQuestionnaire(questionnaireIndex)
  }
  handleEditQuestionnaire(rowIndex) {
    const { editQuestionnaire } = this.props.QuestionnairesActions
    return event => editQuestionnaire(rowIndex)
  }
  handleFillQuestionnaire(rowIndex) {
    const { fillQuestionnaire } = this.props.QuestionnairesActions
    return event => fillQuestionnaire(rowIndex)
  }
  handleCheckData(rowIndex) {
    const { checkData } = this.props.QuestionnairesActions
    return event => checkData(rowIndex)
  }
  handleSortQuestionnaire(dataKey) {
    const { sortQuestionnaire } = this.props.QuestionnairesActions
    return event => sortQuestionnaire(dataKey)
  }
  render() {
    const { questionnaires: { list }, dialog } = this.props
    return list.length ? (
      <div>
        <Table
          className={styles.table}
          data={list}
          ref="table"
        >
          <Column
            name="标题"
            dataKey="title"
            width="30%"
            align="center"
          />
          <Column
            name="时间"
            dataKey="deadline"
            width="20%"
            align="center"
            th={<SortTableTh onSort={this.handleSortQuestionnaire}/>}
            td={({ data, row, dataKey, rowIndex, colIndex }) => {
                const deadline = row[dataKey]
                return deadline
            }}
          />
          <Column
            name="状态"
            dataKey="status"
            width="10%"
            align="center"
            td={({ data, row, dataKey, rowIndex, colIndex }) =>
                <span
                  className={classNames({
                    [styles["on-release"]]: row[dataKey] === ON_RELEASE,
                    [styles["over-release"]]: row[dataKey] === OVER_RELEASE
                  })}
                >
                  {row[dataKey]}
                </span>
            }
          />
          <Column
            name="操作"
            dataKey=""
            width="40%"
            align="center"
            th={(name, dataKey, colIndex) =>
                <Link to="/edit" className={styles.Link}>
                  <span
                    className={styles.button}
                    onClick={this.handleAddQuestionnaire}
                  >
                    新建问卷
                  </span>
                </Link>
            }
            td={({ data, row, rowIndex, colIndex }) =>
              row.status === UN_RELEASE ? (
                <div>
                  <Link to="/edit" className={styles.Link}>
                    <span
                      className={styles.button}
                      onClick={this.handleEditQuestionnaire(rowIndex)}
                    >
                      编辑问卷
                    </span>
                  </Link>
                  <Dialog
                    dialog={{
                      title: "提示",
                      information: "确定删除此问卷？",
                      onConfirm: rowIndex => {
                        this.handleRemoveQuestionnaire(rowIndex)
                      }
                    }}
                    className={styles.dialog}
                  >
                    <span
                      className={styles.button}
                      >
                      删除问卷
                    </span>
                  </Dialog>
                </div>
              ) : row.status === ON_RELEASE ? (
                <div>
                  <Link to="/fill" className={styles.Link}>
                    <span
                      className={styles.button}
                      onClick={this.handleFillQuestionnaire(rowIndex)}
                    >
                      填写问卷
                    </span>
                  </Link>
                  <Link to="/Check" className={styles.Link}>
                    <span
                      className={styles.button}
                      onClick={this.handleCheckData(rowIndex)}
                    >
                      查看数据
                    </span>
                  </Link>
                </div>
              ) : (
                <div>
                  <Link to="/Check" className={styles.Link}>
                    <span
                      className={styles.button}
                      onClick={this.handleCheckData(rowIndex)}
                    >
                      查看数据
                    </span>
                  </Link>
                  <Dialog
                    dialog={{
                      title: "提示",
                      information: "确定删除此问卷？",
                      onConfirm: rowIndex => {
                        this.handleRemoveQuestionnaire(rowIndex)
                      }
                    }}
                    className={styles.dialog}
                  >
                    <span
                      className={styles.button}
                      >
                      删除问卷
                    </span>
                  </Dialog>
                </div>
              )
            }
          />
        </Table>
      </div>
    ) : (
      <div className={styles.wrap}>
        <Link to="/edit" className={styles.Link}>
          <span
            className={styles.button}
            onClick={this.handleAddQuestionnaire}
          >
            新建问卷
          </span>
        </Link>
      </div>
    )
  }
}

export default Home

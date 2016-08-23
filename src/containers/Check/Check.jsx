import React, { Component, PropTypes } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { Link } from "react-router"
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { isInteger, mapHsvToRgb } from "../../scripts/util"
import classNames from "classnames"
import styles from "./Check.scss"
import * as QuestionnairesActions from "../../actions/QuestionnairesActions"

const mapStateToProps = state => ({
  questionnaires: state.questionnaires
})

const mapDispatchToProps = dispatch => ({
  QuestionnairesActions: bindActionCreators(QuestionnairesActions, dispatch)
})

@connect(mapStateToProps, mapDispatchToProps)
class Check extends Component {
  constructor(props) {
    super(props)
  }
  getColor() {
    return mapHsvToRgb((Math.random() + 0.618034) % 1, .5, .95);
  }
  renderCharts(question, questionIndex, data) {
    switch(question.type) {
      case 'SC': {
        const { options } = question
        const statistic = []
        data.forEach(answer => {
          const optionIndex = answer[questionIndex]
          const option = options[optionIndex]
          statistic[optionIndex] ? statistic[optionIndex].value++ : statistic[optionIndex] = { name: option, value: 1 }
        })
        options.forEach((option, optionIndex) => {
          const rate = statistic[optionIndex] ? statistic[optionIndex].value / data.length * 100 : 0;
          const value = isInteger(rate) ? rate : Number(rate.toFixed(2));
          statistic[optionIndex] = { name: option, value };
        })
        return (
          <PieChart
            width={350}
            height={300}
          >
            <Pie
              data={statistic}
              fill={this.getColor()}
              cx={175}
              cy={150}
              outerRadius={100}
              label
            />
            <Tooltip />
          </PieChart>
        );
      }
      case 'MC': {
        const { options } = question
        const statistic = { name: '数据占比' }
        data.forEach(answer => answer[questionIndex].forEach(optionIndex => {
          const option = options[optionIndex]
          statistic[option] = statistic[option] + 1 || 1;
        }))
        options.forEach(option => {
          const rate = statistic[option] / data.length * 100 || 0
          statistic[option] = isInteger(rate) ? rate : Number(rate.fixed(2))
        })
        return (
          <ResponsiveContainer
            width="100%"
            height={60 * options.length}
          >
            <BarChart
              layout="vertical"
              data={[statistic]}
              margin={{top: 15, right: 35, left: 20, bottom: 5}}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                />
              <YAxis
                type="category"
                dataKey="name"
                />
              <CartesianGrid strokeDasharray="3 3" />
              <Legend />
              {options.map((option, optionIndex) =>
                <Bar
                  key={optionIndex}
                  dataKey={option}
                  fill={this.getColor()}
                  label
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        )
      }
      case 'TX': {
        const { content } = question;
        const value = "有效回答占比";
        const statistic = { name: "文本题", [value]: 0 };
        data.forEach(answer => answer[questionIndex] && statistic[value]++);
        const rate = statistic[value] / data.length * 100;
        statistic[value] = isInteger(rate) ? rate : Number(rate.toFixed(2));
        return (
          <ResponsiveContainer
            width="100%"
            height={80}
          >
            <BarChart
              layout="vertical"
              data={[statistic]}
              margin={{top: 5, right: 35, left: 20, bottom: 5}}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
              />
              <YAxis
                type="category"
                dataKey="name"
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Legend />
              <Bar
                dataKey="有效回答占比"
                fill={this.getColor()}
                label
              />
            </BarChart>
          </ResponsiveContainer>
        )
      }
    }
  }
  render() {
    const { list, editing: { id } } = this.props.questionnaires
    const { title, questions, data } = list[id]
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
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
              {this.renderCharts(question, questionIndex, data)}
            </div>
          )}
        </div>
        <hr className={styles.line}></hr>
        <div className={styles.footer}>
          <Link to="/">
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

export default Check

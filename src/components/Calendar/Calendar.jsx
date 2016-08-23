import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import styles from "./Calendar.scss";

class Calendar extends Component{
  constructor(props) {
    super(props)
    this.handleShowCalendar = this.handleShowCalendar.bind(this)
    this.handleHideCalendar = this.handleHideCalendar.bind(this)
    this.handleSelectDay = this.handleSelectDay.bind(this)
    this.handleChangeStartTime = this.handleChangeStartTime.bind(this)
    this.handleChangeTdtype = this.handleChangeTdtype.bind(this)
    this.renderByDay = this.renderByDay.bind(this)
    this.renderByMonth = this.renderByMonth.bind(this)
    this.renderByYear = this.renderByYear.bind(this)
    this.renderBytdType = this.renderBytdType.bind(this)
  }

  handleShowCalendar() {
    this.props.showCalendar()
  }
  handleHideCalendar() {
    this.refs.calendar.className += " "+styles.calendarOut
    this.refs.mask.className += " "+styles.maskOut
    setTimeout(this.props.hideCalendar, 300)
  }
  handleSelectDay(event) {
    const target = event.target
    const tdValue = target.innerHTML
    const selectedDay = this.refs.calendarTitle.innerHTML + ' － ' + tdValue
    target.className += ' '+styles.selected
    this.props.selectDay(selectedDay)
  }
  handleChangeStartTime(event) {
    const { tdType, startTime } = this.props.calendar
    var newTime = null
    const target = event.target
    this.refs.tbody.className = styles.tbodyOut
    if(target.id == "earlier") {
      var endOfearlierMonth = new Date(startTime.getFullYear(), startTime.getMonth(), 0)
      switch(tdType) {
        case "day":newTime = new Date(startTime.getFullYear(), startTime.getMonth()-1, endOfearlierMonth.getDate());break;
        case "month":newTime = new Date(startTime.getFullYear(), 0, 0);break;
        case "year":newTime = new Date(startTime.getFullYear()-16, 1, 1);break;
      }
    }else if(target.id == "later"){
      switch(tdType) {
        case "day":newTime = new Date(startTime.getFullYear(), startTime.getMonth()+1, 1);break;
        case "month":newTime = new Date(startTime.getFullYear(), 11, 32);break;
        case "year":newTime = new Date(startTime.getFullYear()+16, 1, 1);break;
      }
    }else {
      var targetInner = event.target.innerHTML;
      switch(tdType) {
        case "month":
          if(targetInner-1 == startTime.getMonth()){
            newTime = new Date(startTime.getFullYear(), targetInner-1, startTime.getDate());break;
          }
          newTime = new Date(startTime.getFullYear(), targetInner-1, 1);break;
        case "year":
        if(targetInner == startTime.getFullYear()){
          newTime = startTime;break;
        }
        newTime = new Date(targetInner, 1, 1);break;
      }
    }
    setTimeout(() => {
      this.props.changeStartTime(newTime)
      this.refs.tbody.className = styles.tbodyIn
    }, 300)
  }
  handleChangeTdtype(event) {
    var tdType = this.props.calendar.tdType
    const tagName = event.target.tagName
    if(tdType!="year" || tagName!="SPAN")
    this.refs.tbody.className = styles.tbodyOut
    if(tagName == "SPAN") {
      switch(tdType) {
        case "day":tdType = "month";break;
        case "month":tdType = "year";break;
        case "year":return;
      }
    }else {
      switch(tdType) {
        case "day":tdType = "day";break;
        case "month":tdType = "day";break;
        case "year":tdType = "month";break;
      }
    }
    setTimeout(() => {
      this.props.changeTdtype(tdType)
      this.refs.tbody.className = styles.tbodyIn
    }, 300)
  }

  renderByDay() {
    const { startTime, selectedDay } = this.props.calendar
    var dateNow = new Date()
    var endOfMonth = new Date(startTime.getFullYear(), startTime.getMonth()+1, 0)//月末那天
    var firstDaysWeek = new Date(startTime.getFullYear(), startTime.getMonth(), 1).getDay()//1号星期几
    firstDaysWeek = firstDaysWeek == 0 ? 7 : firstDaysWeek
    var counts = endOfMonth.getDate()//天数
    var rowCounts = Math.ceil((counts + firstDaysWeek - 1) / 7)//行数
    var rows = []
    for(var i=0; i<rowCounts; i++) {//渲染行
      var days = []
        for(var j=(i*7)+1; j<((i+1)*7)+1; j++) {//渲染每一天
          var dayNum = j-firstDaysWeek+1;
          if(dayNum>0 && j<counts+firstDaysWeek ) {
            var dateObj = new Date(startTime.getFullYear(), startTime.getMonth(), dayNum)
            var tdStyle = 'normal'
            var clickHandle = (event) => {
              this.handleSelectDay(event)
              this.handleHideCalendar()
            }
            if(dateNow >= new Date(startTime.getFullYear(), startTime.getMonth(), dayNum+1)){
              tdStyle = 'gray'
              clickHandle = ()=>{}
            }
            if(dateNow.getDate()==j&dateNow.getMonth()==startTime.getMonth()&dateNow.getFullYear()==startTime.getFullYear())
              tdStyle = 'now'
            if(selectedDay.split(' ')[4] == j)
              tdStyle = 'selected'
            days.push(<td key={j}
                          className={classNames({
                            [styles["dates"]]: true,
                            [styles[tdStyle]]: true
                          })}
                          onClick={clickHandle}
                      >
                        {dayNum}
                      </td>)
          }else {
            days.push(<td key={j}></td>)
          }
        }
      rows.push(<tr key={i}>{days}</tr>)
    }
    rows.unshift(<tr key={i}>
                  <td key={j+1} style={{borderBottom:'1px solid rgb(200,200,200)'}}>一</td>
                  <td key={j+2} style={{borderBottom:'1px solid rgb(200,200,200)'}}>二</td>
                  <td key={j+3} style={{borderBottom:'1px solid rgb(200,200,200)'}}>三</td>
                  <td key={j+4} style={{borderBottom:'1px solid rgb(200,200,200)'}}>四</td>
                  <td key={j+5} style={{borderBottom:'1px solid rgb(200,200,200)'}}>五</td>
                  <td key={j+6} style={{borderBottom:'1px solid rgb(200,200,200)'}}>六</td>
                  <td key={j+7} style={{borderBottom:'1px solid rgb(200,200,200)'}}>日</td>
                 </tr>)
    return rows
  }

  renderByMonth() {//4*4
    var startTime = this.props.calendar.startTime
    var dateNow = new Date()
    var rows = []
    var monthNow = dateNow.getMonth()+1
    var yearNow = dateNow.getFullYear()
    for(var i=0;i<4;i++) {
      var months = []
      for(var j=(i*4)-1;j<(i*4)+3;j++){
        if(j>0&&j<13) {
          var monthObj = new Date(startTime.getFullYear(), j-1, 1)
          var monthStr = monthObj.getFullYear() + ' － ' + j
          var tdStyle = 'normal'
          var clickHandle = (event) => {
            this.handleChangeTdtype(event)
            this.handleChangeStartTime(event)
          }
          if(j<monthNow && startTime.getFullYear() == yearNow) {
            tdStyle = 'gray'
            clickHandle = ()=>{}
          }else if(startTime.getFullYear() < yearNow) {
            tdStyle = 'gray'
            clickHandle = ()=>{}
          }
          if(monthNow==j&dateNow.getFullYear()==startTime.getFullYear())
            tdStyle = 'now'
          months.push(<td
                        key={j}
                        style={{width: '25%'}}
                        onClick={clickHandle}
                        className={classNames({
                          [styles["dates"]]: true,
                          [styles[tdStyle]]: true
                        })}
                      >
                        {j}
                      </td>)
        }else {
          months.push(<td key={j}></td>)
        }
      }
      rows.push(<tr key={i}>{months}</tr>)
    }
    return rows
  }

  renderByYear() {//4*4
    var startTime = this.props.calendar.startTime
    var dateNow = new Date()
    var yearNow = dateNow.getFullYear()
    var rows = []
    for(var i=0;i<4;i++) {
      var years = []
      for(var j=(i*4);j<(i*4)+4;j++){
        var yearObj = new Date(startTime.getFullYear(), 0, 1)
        var yearStr = yearObj.getFullYear()+j
        var tdStyle = 'normal'
        var clickHandle = (event) => {
          this.handleChangeTdtype(event)
          this.handleChangeStartTime(event)
        }
        if(yearStr<yearNow) {
          tdStyle = 'gray'
          clickHandle = ()=>{}
        }
        if(yearStr==yearNow)
          tdStyle = 'now'
        years.push(
          <td key={j}
              onClick={clickHandle}
              className={classNames({
                [styles["dates"]]: true,
                [styles[tdStyle]]: true
              })}
          >
            {yearStr}
          </td>
         )
      }
      rows.push(<tr key={i}>{years}</tr>)
    }
    return rows
  }

  renderBytdType() {
    const tdType = this.props.calendar.tdType
    var rows = null
    switch(tdType) {
      case "day":rows = this.renderByDay();break;
      case "year":rows = this.renderByYear();break;
      case "month":rows = this.renderByMonth();break;
    }
    return rows
  }

  render() {
    const { visible ,startTime, tdType, selectedDay } = this.props.calendar
    var startTimeStr = ''
    switch(tdType) {
      case "day":startTimeStr = startTime.getFullYear() + ' － ' + (startTime.getMonth()+1);break;
      case "month":startTimeStr = startTime.getFullYear();break;
      case "year":startTimeStr = startTime.getFullYear() + ' － ' + (startTime.getFullYear()+15);break;
    }
    return visible ? (
      <div className={"components-Calender "+styles["container"]}>
        <input
          className={styles.inputBox}
          value={selectedDay}
          onClick={this.handleShowCalendar}
          readOnly="readOnly"
        />
      <div className={styles.calendar} ref="calendar">
          <table>
            <caption>
              <span id="earlier" onClick={this.handleChangeStartTime}></span>
              <span ref="calendarTitle" onClick={this.handleChangeTdtype}>{startTimeStr}</span>
              <span id="later" onClick={this.handleChangeStartTime}></span>
            </caption>
            <tbody ref="tbody">
              {this.renderBytdType()}
            </tbody>
          </table>
        </div>
        <div
          className={styles.mask}
          onClick={this.handleHideCalendar}
          ref="mask"
        >
        </div>
      </div>
    ) : (
      <div className={"components-Calender "+styles["container"]}>
        <input
          className={styles.inputBox}
          value={selectedDay}
          onClick={this.handleShowCalendar}
          readOnly="readOnly"
        />
      </div>
    )
  }
}

export default Calendar;

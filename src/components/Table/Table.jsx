import React, { PropTypes, isValidElement, cloneElement } from 'react'
import { isFunction, mapChildrenToArray } from '../../scripts/util'
import styles from './Table.scss'

class Table extends React.Component {
  constructor(props) {
    super(props)
  }
  renderThs(columns) {
    return columns.map((col, colIndex) => {
      const { name, dataKey, width, align, th } = col.props
      const props = { name, dataKey, colIndex }
      let content
      switch(true) {
        case isValidElement(th): content = cloneElement(th, props); break;
        case isFunction(th): content = th(props); break;
        default: content = name || ""
      }
      return (
        <th
          key={`th-${colIndex}`}
          style={{ width, textAlign: align }}
          className={styles["table-th"]}
        >
          {content}
        </th>
      )
    })
  }
  renderTrs(columns, data) {
    return data.map((row, rowIndex) =>
      <tr
        key={`td-${rowIndex}`}
        className={styles["table-tbody-tr"]}
      >
        {this.renderTds(columns, data, row, rowIndex)}
      </tr>
    )
  }
  renderTds(columns, data, row, rowIndex) {
    return columns.map((col, colIndex) => {
      const { dataKey, width, align, td } = col.props
      const props = { data, row, dataKey, rowIndex, colIndex }
      let content
      switch(true) {
        case isValidElement(td): content = cloneElement(td, props); break;
        case isFunction(td): content = td(props); break;
        default: content = row[dataKey]
      }
      return (
        <td
          key={`td-${rowIndex}-${colIndex}`}
          style={{ width, textAlign: align}}
          className={styles["table-td"]}
        >
          {content}
        </td>
      )}
    )
  }
  render() {
    const { data, children, className } = this.props
    const columns = mapChildrenToArray(children)
    return (
      <table className={className}>
        <thead>
          <tr>
            {this.renderThs(columns)}
          </tr>
        </thead>
        <tbody>
          {this.renderTrs(columns, data)}
        </tbody>
      </table>
    )
  }
}

export default Table

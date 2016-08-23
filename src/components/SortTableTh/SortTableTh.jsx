import React, { Component, PropTypes } from 'react'
import styles from './SortTableTh.scss'

class SortTableTh extends Component {
  static propTypes = {
    onSort: PropTypes.func.isRequiered
  }
  constructor(props) {
    super(props)
    this.handleSort = this.handleSort.bind(this)
  }
  componentDidMount() {
    const { dataKey, onSort } = this.props
    this.onSort = onSort(dataKey)
  }
  handleSort() {
    this.onSort()
  }
  render() {
    const { name } = this.props
    return (
      <div
        className={styles['sort-th']}
        onClick={this.handleSort}
      >
        <span>{name}</span>
      </div>
    )
  }
}

export default SortTableTh

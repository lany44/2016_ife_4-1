import React, { Component, PropTypes } from "react"
import styles from "./App.scss"
import "../../styles/reset.css"
import { Dialog, Header } from "../../components"

class App extends Component {
  constructor(props){
    super(props)
  }
  render() {
    const { actions, dialog, children } = this.props
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.main}>
          {children}
        </div>
      </div>
    )
  }
}

export default App;
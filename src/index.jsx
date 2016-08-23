import React from "react"
import { render } from "react-dom"
import { App, Home, Edit, Fill, Check } from "./containers"
import { Provider } from "react-redux"
import configureStore from "./store/configureStore"
import { Router, Route, IndexRoute, hashHistory } from "react-router"
import { syncHistoryWithStore } from "react-router-redux"

const store = configureStore()
const history = syncHistoryWithStore(hashHistory, store)

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="edit" component={Edit} />
        <Route path="fill" component={Fill} />
        <Route path="check" component={Check} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root'),
)

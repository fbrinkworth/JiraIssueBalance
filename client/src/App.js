import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import "./App.css";
import "./App.scss";

import Home from "./Home";
import JiraIssuesBalance from "./JiraIssuesBalance";
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/' exact component={Home}/>
          <Route path='/error/:id' exact render={({match}) => (
            <Home 
              error={match.params.id}
            />
          )}/>
          <Route path='/jiraissuesbalance' exact component={JiraIssuesBalance}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Layout from './hoc/layout'
import Home from './components/home'
import RegisterLogin from './components/register_login'
import Register from './components/register_login/register'
import UserDashboard from './components/user'
import Auth from './hoc/auth'

const Routes = () => {
  return (
    <Layout>
      <Switch>
        <Route path="/" exact component={Auth(Home, null)} />
        <Route path="/dashboard" exact component={Auth(UserDashboard, true)} />
        <Route path="/login" exact component={Auth(RegisterLogin, false)} />
      </Switch>
    </Layout>
  )
}

export default Routes

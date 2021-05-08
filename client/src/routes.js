import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Layout from './hoc/layout'
import Home from './components/home'
import RegisterLogin from './components/register_login'
import UserFavourites from './components/user/favourites'
import Auth from './hoc/auth'

const Routes = () => {
  return (
    <Layout>
      <Switch>
        <Route path="/" exact component={Auth(Home, true)} />
        <Route
          path="/user/favourites"
          exact
          component={Auth(UserFavourites, true)}
        />
        <Route path="/login" exact component={Auth(RegisterLogin, false)} />
      </Switch>
    </Layout>
  )
}

export default Routes

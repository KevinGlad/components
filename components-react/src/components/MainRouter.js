import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './Login'
import Signup from './SignUp'
import AppBar from './AppBar'
import UsersF from './UsersF'
import { LoginProvider } from './LoginContext'
import ProtectedRoute from './ProtectedRoute'

export default function MainRouter() {

    return (
        <div>
            <Router>
                <LoginProvider>
                    <AppBar></AppBar>
                    <Switch>
                        <Route path="/signup" component={Signup}></Route>
                        <ProtectedRoute path="/users" component={UsersF}></ProtectedRoute>
                        <Route path="/" component={Login}></Route>
                    </Switch>
                </LoginProvider>
            </Router>
        </div>
    )
}
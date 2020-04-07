// class component
import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { uriBase, api } from '../const'
import { LoginContext } from './LoginContext'
import queryString from 'query-string'

export default function Login(props) {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { loggedIn, setLoggedIn, token, writeToken } = useContext(LoginContext)

    const onClickHandler = () => {
        let body = {
            email,
            password
        }

        fetch(`${uriBase}${api}/users/login`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(httpResponse => {

                if (!httpResponse.ok) {
                    throw new Error("Couldn't Send Login")
                }
                return httpResponse.json()
            })
            .then(response => {

                if (response.hasOwnProperty("token")) {
                    setLoggedIn(true)
                    writeToken(response.token)
                    //props.history.push('/users')
                } else {
                    setLoggedIn(false)
                    writeToken("")
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    const getLogin = () => {
        window.location.href = `${uriBase}/api/v1/users/auth/googlelogin`
    }

    const isLoggedIn = () => {

        const parsed = queryString.parseUrl(window.location.href);

        // check to see if we have any query key value pairs
        if (Object.keys(parsed.query).length > 0) {
            // have to make an new object.  If we don't
            // we get an error parsed.query.hasOwnProperty is not a method
            let query = {...parsed.query}
            // check to see if we have a token
            if (query.hasOwnProperty("token")) {
                verifyToken(query.token)
            }
        }
    }

    const verifyToken = (token) => {

        fetch(`${uriBase}${api}/users/auth/verifytoken`,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(httpResponse => {

            if (!httpResponse.ok) {
                throw new Error("Couldn't Login")
            }
            return httpResponse.json()
        })
        .then(response => {

            if (response.hasOwnProperty("token")) {
                setLoggedIn(true)
                writeToken(response.token)
                //props.history.push('/users')
            } else {
                setLoggedIn(false)
                writeToken("")
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        isLoggedIn()
    }, [])

    return (
        <div>
            <div>
                <h1>{name}</h1>
                <h2>{loggedIn ? "Logged In" : "Not Logged In"}</h2>
                    eMail<input onChange={(event) => setEmail(event.target.value)} value={email}></input>
                    Password<input onChange={(event) => setPassword(event.target.value)} value={password}></input>
            </div>
            <div>
                <button onClick={onClickHandler} >Log In</button>
            </div>
            <div>
                <button onClick={getLogin}><img src={`${uriBase}/images/btn_google_signin_light_focus_web@2x.png`} alt="Google Login" /></button>
            </div>
            <div>
                <Link to="/signup">Sign Up</Link>
                <br></br>
                <Link to="/users">Users</Link>
            </div>
        </div>
    )



}
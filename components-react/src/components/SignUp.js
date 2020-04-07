import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {uriBase, api} from '../const'

const useStyles = makeStyles(theme => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),

        },
        "background-color": "grey"
    },
}));

export default function SignUp(props) {

    const classes = useStyles();

    const [message, setMessage] = React.useState("")
    const [fName, setfName] = React.useState("")
    const [lName, setlName] = React.useState("")
    const [userName, setUserName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")

    const onSubmitHandler = (event) => {

        event.preventDefault()

        let formData = new FormData()
        formData.append("fName", fName)
        formData.append("lName", lName)
        formData.append("userName",userName)
        formData.append("email", email)
        formData.append("password", password)
        console.log(...formData.entries())
        fetch(`${uriBase}${api}/users/signup`,{
            method: "POST",
            body: formData
        })
        .then(HttpRequest => {
            if (!HttpRequest.ok) {
                throw new Error("Couldn't Add User")
            }
            return HttpRequest.json()
        })
        .then(user => {
            // ToDo Handle User
            setMessage("Welcome")
        })
        .catch(error => {
            console.log(error)
        })
    }

    const onChangeHandler = (event) => {

        switch (event.target.name) {
            case 'fName':
                setfName(event.target.value)
                break

            case 'lName':
                setlName(event.target.value)
                break

            case 'userName':
                setUserName(event.target.value)
                break

            case 'email':
                setEmail(event.target.value)
                break

            case 'password':
                setPassword(event.target.value)
                break

            default:

        }
    }

    return (

        <div className={classes.root}>

            <h1>{message}</h1>
            <form onSubmit={onSubmitHandler} method="POST">
                <div>
                    First Name<input onChange={onChangeHandler} type="text" name="fName" value={fName}></input>
                    Last Name<input onChange={onChangeHandler} type="text" name="lName" value={lName}></input>
                    Username<input onChange={onChangeHandler} type="text" name="userName" value={userName}></input>
                    eMail<input onChange={onChangeHandler} type="text" name="email" value={email}></input>
                    password<input onChange={onChangeHandler} type="text" name="password" value={password}></input>
                </div>
                <div>
                    <input type="submit"></input>
                    {/* <Button variant="contained" color="primary" onClick={onClickHandler}>Sign Up</Button> */}
                </div>
            </form>
            <div>
                <Link to="/">Login</Link>
            </div>

        </div>
    )
}
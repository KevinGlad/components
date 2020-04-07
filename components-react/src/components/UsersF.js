import React, {useContext} from 'react'
import { uriBase, api } from '../const'
import objectId from 'bson-objectid'
import {LoginContext} from './LoginContext'

export default function UsersF(props) {

    const [users, setUsers] = React.useState([])

    // form data
    const [id, setId] = React.useState(objectId())
    const [fName, setfName] = React.useState("")
    const [lName, setlName] = React.useState("")
    const [userName, setUserName] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [showId, setShowId] = React.useState(true)

    const {token} = useContext(LoginContext)

    const refresh = () => {

        fetch(`${uriBase}${api}/users`,
            {
                method: "GET",
                headers: {
                    'Content-Type': "application/json"
                }
            })
            .then(httpResponse => {
                if (!httpResponse.ok) {
                    throw new Error("Bad Response")
                }
                return httpResponse.json()
            })
            .then(response => {
                console.log(response)
                setUsers(response)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const onEditClickHandler = (index) => (event) => {
        console.log("event",event)
        let user = users[index]
        setId(user._id)
        setfName(user.fName)
        setlName(user.lName)
        setUserName(user.userName)
        setPassword(user.password)
        setShowId(false)
    }

    const onSaveHandler = () => {

        let update = {}
        let method = "PATCH"

        let user = users.find((user) => {
            return user._id === id
        })

        if (user !== undefined) {
            // found we are patching

            if (user.fName !== fName || user.fName === undefined) {
                update.fName = fName
            }

            if (user.lName !== lName || user.lName === undefined) {
                update.lName = lName
            }

            if (user.userName !== userName || user.userName === undefined) {
                update.userName = userName
            }

            if (user.password !== password || user.password === undefined) {
                update.password = password
            }

        } else {
            // not found, we are posting
            method = "PUT"
            update._id = id
            update.fName = fName
            update.lName = lName
            update.userName = userName
            update.password = password
        }
        console.log(update)
        // make sure we are not trying to
        // update with a blank object
        if (Object.entries(update).length > 0) {

            // patch or put
            fetch(`${uriBase}${api}/users/${id}`, {
                method: method,
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(update)
            })
                .then(httpResponse => {
                    if (!httpResponse.ok) {
                        throw new Error(`Couldn't ${method}`)
                    }
                    return httpResponse.json()
                })
                .then(user => {
                    onCancelHandler()
                    refresh()
                })
                .catch(error => {
                    console.log(error)
                })
        }
    } // end of onSaveHandler

    const onCancelHandler = () => {
        setId(objectId())
        setfName("")
        setlName("")
        setUserName("")
        setPassword("")
        setShowId(true)
    }

    const onDeleteClickHandler = (index) => (event) => {

        const id = users[index]._id

        console.log("DEL TOKEN")
        console.log(token)
        fetch(`${uriBase}${api}/users/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(httpResponse => {
                if (!httpResponse.ok) {
                    throw new Error("Delete Failed")
                }
                return httpResponse.json()
            })
            .then(response => {
                refresh()
            })
            .catch(error => {
                console.log(error)
            })
    }

    const onChangeHandler = (event) => {

        switch (event.target.name) {

            case 'id':
                setId(event.target.value)
                break

            case 'fName':
                setfName(event.target.value)
                break

            case 'lName':
                setlName(event.target.value)
                break

            case 'userName':
                setUserName(event.target.value)
                break

            case 'password':
                setPassword(event.target.value)
                break

            default:

        }
    }

    const idField = () => {
        let rtnVal = null

        if (showId === true) {
            rtnVal = (
                <React.Fragment>
                    Id<input onChange={onChangeHandler} type="text" name="id" value={id}></input>
                </React.Fragment>
            )
        }

        return rtnVal

    }

    React.useEffect(() => {

        refresh()
    }, [])

    return (
        <div>
            <h1>Users</h1>
            <div>
                    {
                        users.map((user, index) => {
                            return (
                                <h5 key={index}>{user.fName}
                                    <button onClick={onEditClickHandler(index)}>Edit</button>
                                    <button onClick={onDeleteClickHandler(index)}>Delete</button>
                                </h5>
                            )
                        })
                    }
            </div>
            <div>
                {idField()}
                First Name<input onChange={onChangeHandler} type="text" name="fName" value={fName}></input>
                Last Name<input onChange={onChangeHandler} type="text" name="lName" value={lName}></input>
                Username<input onChange={onChangeHandler} type="text" name="userName" value={userName}></input>
                password<input onChange={onChangeHandler} type="text" name="password" value={password}></input>

            </div>
            <div>
                <button onClick={onSaveHandler}>Save</button>
                <button onClick={onCancelHandler}>Cancel</button>
            </div>
        </div>
    )
}
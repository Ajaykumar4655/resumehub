import React from 'react'
import { Link } from 'react-router-dom'

function Button(props) {
    return (
        <>
            <Link className={props.className} to={props.url} state={props.state}>{props.name}</Link>
        </>
    )
}

export default Button
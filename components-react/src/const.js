// set up as a ternary so optimizer will optimize out the code that is never run
const uriBase = process.env.NODE_ENV !== 'production' ? (
    "http://localhost:3001"
) : (
    ""
)

const api = "/api/v1"

module.exports.uriBase = uriBase
module.exports.api = api

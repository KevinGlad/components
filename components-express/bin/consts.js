// set up as a ternary so optimizer will optimize out the code that is never run
const uriServer = process.env.NODE_ENV !== 'production' ? (
    "http://localhost:3001"
) : (
    "https://kglad-components.herokuapp.com"
)

module.exports.uriServer = uriServer
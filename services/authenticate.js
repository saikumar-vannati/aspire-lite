const models = require('../models')

const { responseFormatter, verifyToken } = require('../lib/utilities')

/**
 * user authentication middleware
 * Authenticates the user and pass the control flow to controller
 */
exports.authenticate = async function authenticateUser (req, res, next) {

    // Get the token from the request headers
    const token = req.headers.authorization;

    // Validate and decode the token
    if (!token) return res.status(401).send(responseFormatter("", "unauthorized"));

    const decodedToken = await verifyToken(token)

    if (!decodedToken) {
        return res.status(401).send(responseFormatter("", "unauthorized"));
    }

    const { id } = decodedToken

    const user = await models.user.findOne({
        where: {
            id: id
        },
        raw: true
    })

    // Authenticate user
    if (!user) return res.status(403).send(responseFormatter("", "unauthorized"));

    // Authentication successful
    req.user = user 

    return next();
}
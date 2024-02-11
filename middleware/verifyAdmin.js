const jwt = require("jsonwebtoken");
const config = process.env;
const { users } = require("../model/userModel");
const verifyAdmin = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res
            .status(403)
            .send({ message: "A token is required for authentication" });
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
        const fetchAdmin = await users.findOne({ _id: req.user._id }).select({ role: 1 })
        if (fetchAdmin.role !== "Admin") {
            next()
            return res.status(401).send({ message: "Only Admin Have Access" });
        }

    } catch (err) {
        return res.status(401).send({ message: "Invalid Token" });
    }
    return next();
};

module.exports = verifyAdmin;
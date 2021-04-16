//imports
const jwt = require("jsonwebtoken");
const tokenGenerator = (id) => {
    const token = jwt.sign({ id }, process.env.SECRETKEY, { expiresIn: '100s' });
    return token;
}
const tokenValidator = async (req, res, next) => {
    try {
        const jwttoken = req.cookies.jwttoken;
        const valid = await jwt.verify(jwttoken, process.env.SECRETKEY);
        if (valid) return next();
        else res.render("login", { message: "Please Login !" });
    }
    catch (err) {
        res.render("login", { message: "Please Login !" });
    }
}
module.exports = { tokenGenerator, tokenValidator };
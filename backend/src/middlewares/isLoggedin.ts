import jwt from 'jsonwebtoken';

const isLoggedin = (req, res, next) => {
    if (req.path === '/api/habit/reset') return next()
    if (req.cookies.token) {
        const token = req.cookies.token;
        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorizedddd' });
            }
            req.user = decoded; // Attach user info to request object
            next(); // Proceed to the next middleware or route handler
        });
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

export default isLoggedin;
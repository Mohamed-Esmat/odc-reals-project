
import HTTPStatus from 'http-status';
import {toAuthJSON} from '../utils.js'
export const googleSignup = async (req, res, next) => {
res.status(HTTPStatus.CREATED).json(toAuthJSON(req.user));
return next();
};


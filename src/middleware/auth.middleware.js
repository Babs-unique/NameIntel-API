import  { verifyAccessToken } from '../utils/jwt.js';


const authMiddleware = async (req, res, next) => {
   /*  const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }

    try {
        const decoded = await verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        }); 
    } */
    let authHeader = req.cookies?.accessToken;
    if(!authHeader){
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }
    try {
        const token = authHeader;
        const decoded = await verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
 }



export { authMiddleware as authenticate };
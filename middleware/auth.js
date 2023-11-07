import jwt from "jsonwebtoken";

import pool from "../db.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json("Not authorized, please login");
    }

    //verify token
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const admin_user_ids = JSON.parse(process.env.admin_user_ids);

    const isAdmin = admin_user_ids.includes(verify.email);
    console.log(isAdmin);
    const user = await pool.query(
      `SELECT user_id,email,
      CASE
        WHEN $2 THEN 1
        ELSE 0
      END AS isAdmin
      FROM users WHERE user_id=$1`,
      [verify.id, isAdmin]
    );
    console.log(user);
    if (!user.rows[0]) {
      res.status(400);
      return res.status(401).json("User not found");
    }

    req.user = user.rows[0];
    next();
  } catch (error) {
    res.status(401);
    return res.status(401).json("Not authorized, please login");
  }
};

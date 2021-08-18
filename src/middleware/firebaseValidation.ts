import admin from "firebase-admin";

admin.initializeApp();

const firebaseValidation = async (req, res, next) => {
  try {
    const tokens = req.headers.authorization
      .split("Bearer ")[1]
      .split(" SEPARATOR ");
    const idToken = tokens[0];

    const decodedToken: admin.auth.DecodedIdToken = await admin
      .auth()
      .verifyIdToken(idToken);
    const uid = decodedToken.uid;
    req.userUid = uid;
    next();
  } catch (error) {
    console.log("verify id token error", error);
    res.status(401).send("Invalid auth");
  }
};

export default firebaseValidation;

import admin from "firebase-admin";

admin.initializeApp();

const firebaseValidation = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization.split("Bearer ")[1];
    const decodedToken: admin.auth.DecodedIdToken = await admin
      .auth()
      .verifyIdToken(idToken);
    const uid = decodedToken.uid;
    req.userUid = uid;
    next();
  } catch (error) {
    console.log("verify id token", error);
    res.status(401).send("Invalid auth");
  }
};

export default firebaseValidation;

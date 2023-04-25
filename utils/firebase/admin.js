import { getAuth, signInWithCustomToken } from "firebase/auth";

// const auth = getAuth();

// const uid = 'some-uid';

// export function signInWithToken(token) {

//   signInWithCustomToken(auth, token)
//     .then((userCredential) => {
//       // Signed in
//       const user = userCredential.user;
//       console.log({ user });
//       return user
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       console.log((errorCode, errorMessage));
//     });
// }
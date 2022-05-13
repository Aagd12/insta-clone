import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import "./Post.css";
import { auth, db, storage } from "./firebase";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Avatar from "@mui/material/Avatar";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Navigate, useNavigate } from "react-router-dom";
import firebase from "firebase/compat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import "./postimage.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { signInWithPhoneNumber } from "firebase/auth";

import {
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { RecaptchaVerifier } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  doc,
  addDoc,
  query,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ChatIcon from "@mui/icons-material/Chat";
import HomeIcon from "@mui/icons-material/Home";
const App = () => {
  const nevigate = useNavigate();
  const [posts, setposts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignModel, setOpenSignModel] = useState(false);
  const [photoModel, setphotoModel] = useState(false);
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [number, setnumber] = useState("");
  const [user, setuser] = useState("");
  const [caption, setcaption] = useState("");
  const [progress, setprogress] = useState(0);
  const [code, setcode] = useState("");
  const [openchat, setopenchat] = useState(false);
  const [comment, setcomment] = useState("");
  const [comments, setcomments] = useState("");
  const [state, setstate] = useState(false);
  const setHandler = (e) => {
    e.preventDefault();
    let file = e.target[0].files[0];
    setImage(file);
    setprogress(0);
    setcaption("");
    file = null;
  };
  const setImage = (file) => {
    if (file) {
      const storageRef = ref(storage, `/images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setprogress(progress);
        },
        (error) => {
          alert(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((URL) => {
            addDoc(collection(db, "posts"), {
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: URL.toString(),
              username: user.displayName,
            });
          });
          console.log(posts);
          console.log(posts.imageUrl);
          setprogress(0);
          setcaption("");

          file = [];
        }
      );
    } else {
      return;
    }
  };
  const signUp = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(auth);
        sendVerificationEmail();
        //signUpWithPhone();
        const user = userCredential.user;
        return updateProfile(user, {
          displayName: `${username}`,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
    setemail("");
    setnumber("");
    setpassword("");
    setusername("");
  };

  // send verification email
  const sendVerificationEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        alert(
          "Verification link sent to your email. Kinldy check to verify your account"
        );
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const signIn = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in

        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(error.message);
      });
    setOpenSignModel(false);
  };
  // const signUpWithPhone = (e) => {
  //   e.preventDefault();
  //   //making recaptch
  //   window.recaptchaVerifier = new RecaptchaVerifier(
  //     "recaptcha-container",
  //     {
  //       size: "normal",
  //       callback: (response) => {
  //         // reCAPTCHA solved, allow signInWithPhoneNumber.
  //         // ...
  //       },
  //       "expired-callback": () => {
  //         // Response expired. Ask user to solve reCAPTCHA again.
  //         // ...
  //       },
  //     },
  //     auth
  //   );
  //   console.log("hiii");
  //   const appVerifier = window.recaptchaVerifier;
  //   console.log("bi");
  //   signInWithPhoneNumber(auth, number, appVerifier)
  //     .then((confirmationResult) => {
  //       // SMS sent. Prompt user to type the code from the message, then sign the
  //       // user in with confirmationResult.confirm(code).
  //       window.confirmationResult = confirmationResult;
  //       console.log("hi");
  //       alert("check phone number");
  //       const varificationcode = prompt("ENTER VARIFICATION CODE");
  //       setcode(varificationcode);
  //       confirmationResult.confirm(code);
  //     })
  //     // ...
  //     .catch((error) => {
  //       // Error; SMS not sent
  //       console.log(error);
  //     });
  //   // Error; SMS not sent
  //   // ...
  //   //
  //
  useEffect(() => {
    const unsubscribed = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        console.log(authUser);

        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setuser(authUser);
      } else {
        // User is signed out
        // ...
        setuser("");
      }
    });
    return () => {
      unsubscribed();
    };
  }, [user, username]);
  useEffect(() => {
    const postCol = collection(db, "chats");
    const posttimecol = query(postCol, orderBy("timestamp", "desc"));
    let unsubscribe = onSnapshot(posttimecol, (snapshot) => {
      console.log(snapshot.docs.map(doc => doc.data()));
      setcomments(snapshot.docs.map((doc) => doc.data()));
      setcomment("");
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const post_chat = (e) => {
    e.preventDefault();
    const postCol = collection(db, "chats");
    addDoc(postCol, {
      text: comment,
      username: `${user.displayName}`,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setcomment("");
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const getpos = () => {
    const postCol = collection(db, "posts");
    const newPostCol = query(postCol, orderBy("timestamp", "desc"));
    onSnapshot(newPostCol, (snapshot) => {
      setposts(snapshot.docs.map((doc) => doc.data()));
    });
  };
  useEffect(() => {
    getpos();
  }, []);
  return (
    <div className='App'>
      <div className='app__header'>
        <img
          className='app__headerImg'
          src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
          alt='instagram....'
        />

        <input
          className='search__input'
          type='search'
          name='search'
          id='search'
          placeholder='Search'
        />
        {user && (
          <ChatIcon
            onClick={() =>
              !user.emailVerified
                ? alert("plz varify your email")
                : setopenchat(true)
            }
            className='chaticon'></ChatIcon>
        )}
        {!user ? (
          <div className='login'>
            <button
              className='signbutton'
              type='submit'
              onClick={() => setOpenSignModel(true)}>
              Signin
            </button>
            <button
              className='signbutton'
              id='sign-in-button'
              type='submit'
              onClick={handleOpen}>
              Sign Up
            </button>
          </div>
        ) : (
          <div className='login'>
            <button
              className='signbutton'
              type='submit'
              onClick={() => auth.signOut()}>
              Logout
            </button>
          </div>
        )}
      </div>
      <Modal
        open={photoModel}
        onClose={() => setphotoModel(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'>
        <Box sx={style_chat}>
          <div className='photo'>
            <form onSubmit={setHandler}>
              <div className='imageUpload'>
                <center>
                  <div className='close'>
                    <CloseIcon
                      onClick={() => setphotoModel(false)}
                      className='closeicon'></CloseIcon>
                  </div>
                </center>

                {progress > 0 && (
                  <div className='progress_bar'>
                    <progress className='progress' max='100' value={progress} />
                  </div>
                )}

                <div className='sec'>
                  <div className='image'>
                    <input type='file' />
                  </div>
                </div>

                <input
                  type='text'
                  className='caption'
                  placeholder='caption'
                  value={caption}
                  onChange={(e) => setcaption(e.target.value)}
                />
                <button type='submit' className='upload'>
                  Upload
                </button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'>
        <Box sx={style}>
          <form>
            <center>
              <div className='post_comment'></div>
              <div className='sign_up'>
                <img
                  className='app__headerImg'
                  src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                  alt='instagram....'
                />
                <input
                  type='text'
                  className='username2'
                  value={username}
                  placeholder='Username'
                  onChange={(e) => setusername(e.target.value)}
                />
                <input
                  type='number'
                  name='number'
                  value={number}
                  className='email'
                  placeholder='Phone Number'
                  onChange={(e) => setnumber(e.target.value)}
                />
                <div id='recaptcha-container'></div>
                <input
                  type='email'
                  className='email'
                  value={email}
                  placeholder='email'
                  onChange={(e) => setemail(e.target.value)}
                />
                <input
                  type='password'
                  value={password}
                  className='password'
                  placeholder='password'
                  onChange={(e) => setpassword(e.target.value)}
                />
                <button className='resister' type='button' onClick={signUp}>
                  Sign Up
                </button>
              </div>
            </center>
          </form>
        </Box>
      </Modal>
      <Modal
        open={openchat}
        onClose={() => setopenchat(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'>
        <Box sx={style_chat}>
          <div className='chat'>
            <center>
              <HomeIcon
                style={{ cursor: "pointer" }}
                onClick={() => setopenchat(false)}></HomeIcon>

              {comments &&
                comments.map((com, index) => {
                  return (
                    <p
                      key={index}
                      className={
                        com.username == user.displayName
                          ? "caption_foo"
                          : "caption_right"
                      }>
                      <strong className='caption_mar'>{com.username}</strong>
                      <span className='caption_mar'>{com.text}</span>
                    </p>
                  );
                })}
              <form>
                <input
                  className='comment'
                  type='text'
                  value={comment}
                  onChange={(e) => setcomment(e.target.value)}
                  placeholder='Write'
                />

                {comment && (
                  <SendIcon
                    style={{ cursor: "pointer" }}
                    className='post'
                    onClick={post_chat}></SendIcon>
                )}
              </form>
            </center>
          </div>
        </Box>
      </Modal>
      <Modal
        open={openSignModel}
        onClose={() => setOpenSignModel(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'>
        <Box sx={style}>
          <form>
            <center>
              <div className='sign_up'>
                <img
                  className='app__headerImg'
                  src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                  alt='instagram....'
                />
                <input
                  type='email'
                  className='email'
                  value={email}
                  placeholder='email'
                  onChange={(e) => setemail(e.target.value)}
                />
                <input
                  type='password'
                  value={password}
                  className='password'
                  placeholder='password'
                  onChange={(e) => setpassword(e.target.value)}
                />
                <button className='resister' type='button' onClick={signIn}>
                  SignIn
                </button>
              </div>
            </center>
          </form>
        </Box>
      </Modal>
      {user && (
        <AddAPhotoIcon
          className='addPhoto'
          onClick={() =>
            !user.emailVerified
              ? alert("plz varify your email")
              : setphotoModel(true)
          }></AddAPhotoIcon>
      )}
      <div className='right_bar'>
        <center>
          <img
            src='https://cdn.gsmarena.com/imgroot/news/18/03/instagram-timeline-changes/-728/gsmarena_001.jpg'
            alt=''
            className='insta'
          />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
            voluptatem illum ex minus aperiam tenetur, placeat harum totam
            necessitatibus inventore culpa incidunt cumque! Magnam, at velit
            suscipit ipsa vitae sunt.
          </p>

          <img
            className='instaauthor'
            src='https://firebasestorage.googleapis.com/v0/b/instagram-clone-92f47.appspot.com/o/images%2FScreenshot%20(54).png?alt=media&token=481aea1e-f512-4d2d-a8ba-9c17c1e4a960'
            alt=''
          />
          <h2 style={{ margin: "25px" }}>saurabh kumar pandey</h2>
        </center>
      </div>
      <div className='left_bar'>

        {posts.map((post) => {
          return (
            <Post
              imgUrl={post.imageUrl}
              caption={post.caption}
              username={post.username}
              user={user}
              postId={post.id}
              key={post.id}
            />
          );
        })}
      </div>
    </div>
  );
};

export default App;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 320,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const style_chat = {
  position: "absolute",

  width: "100vw",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  overflow: "scroll",
  height: "100vh",
  p: 4,
};

import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@mui/material/Avatar";
import { auth, db, storage } from "./firebase";
import PersonIcon from "@material-ui/icons/Person";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  doc,
  addDoc,
} from "firebase/firestore";
const Post = ({ imgUrl, caption, username, user,postId }) => {
  const [comments, setcomments] = useState([]);
  const [comment, setcomment] = useState("");
  useEffect(() => {
    const postCol = collection(db, "posts");
    if (postId) {
      let dom = doc(postCol, postId);
      let domcol = collection(dom, "comments");

      let unsubscribe = onSnapshot(domcol, (snapshot) => {
        //console.log(snapshot.docs.map(doc => doc.data()));
        setcomments(snapshot.docs.map((doc) => doc.data()));

        setcomment("");
      });

      return () => {
        unsubscribe();
      };
    }
  }, [postId]);
  const post_chat = (e) => {
    e.preventDefault();
    const postCol = collection(db, "posts");
    const dom = doc(postCol, postId);
    addDoc(collection(dom, "comments"), {
      text: comment,
      username: `${user.displayName}`,
    });
    setcomment("");
  };
  return (
    <div className='posts'>
      <div className='post'>
        <div className='post__header'>
          <AccountCircleIcon />
          <h4 className='username'>{username}</h4>
        </div>
        <div>
          <img className='post__img' src={imgUrl} alt=' postimage....' />
        </div>
        <div>
          <p className='caption_footer'>
            <i>
              <strong className='caption_margin'>{username}</strong>
            </i>
            <i>
              <span>{caption}</span>
            </i>
          </p>
        </div>
        <div className='post_comment'>
          {comments.map((com, index) => {
            return (
              <p key={index} className='caption_foo'>
                <strong className='caption_mar'>{com.username}</strong>
                <span className='caption_mar'>{com.text}</span>
              </p>
            );
          })}
        </div>
        {user && (
          <form>
            <div className='comments caption_footerc'>
              <input
                type='text'
                className='caption_footerst'
                value={comment}
                onChange={(e) => setcomment(e.target.value)}
                placeholder='enter your comments'
              />
              <button
                type='submit'
                onClick={post_chat}
                className='post_chat caption_marginsp'>
                Post
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Post;

import AuthCheck from "../../components/AuthCheck";
import styles from "../../styles/Admin.module.css";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../lib/context";
import {
  firestore,
  auth,
  query,
  serverTimestamp,
  orderBy,
  collection,
  doc,
  setDoc,
} from "../../lib/firebase";

import { useContext, useState } from "react";
import { useRouter } from "next/router";

import { useCollection } from "react-firebase-hooks/firestore";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";

export default function AdminPostsPage({}) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const ref = collection(firestore, "users", auth.currentUser.uid, "posts");
  const queryRes = query(ref, orderBy("createdAt"));
  const [querySnapshot] = useCollection(queryRes);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  const slug = encodeURI(kebabCase(title));

  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = doc(firestore, "users", uid, "posts", slug);

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello smoker",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await setDoc(ref, data);
    toast.success("Post created!");

    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My awesome article!"
        className={styles.input}
      />
      <p>
        <strong>Slug: </strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}

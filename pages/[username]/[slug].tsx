import styles from "../../styles/Post.module.css";
import Link from "next/link";
import {
  collection,
  getDoc,
  getDocs,
  firestore,
  getUserWithUsername,
  postToJSON,
  doc,
  collectionGroup,
} from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import PostContent from "../../components/PostContent";
import AuthCheck from "../../components/AuthCheck";
import HeartButton from "../../components/HeartButton";
export async function getStaticProps({ params }) {
  const { username, slug } = params;
  console.log(username);

  const userDoc = await getUserWithUsername(username);

  let post;
  let path;
  let userArr = [];
  await userDoc.forEach((document) => {
    userArr.push(document);
  });
  console.log(userArr[0].ref);

  if (userDoc) {
    const postRef = doc(collection(userArr[0].ref, "posts"), slug);
    const postDoc = await getDoc(postRef);

    post = postToJSON(postDoc);
    path = postRef.path;
  }

  return {
    props: {
      post,
      path,
    },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const snapshot = await getDocs(collectionGroup(firestore, "posts"));
  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

export default function PostPage(props) {
  const postRef = doc(firestore, props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>
      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} hearts</strong>
        </p>
        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>
      </aside>
    </main>
  );
}

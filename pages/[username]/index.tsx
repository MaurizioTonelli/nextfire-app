import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import {
  getUserWithUsername,
  collection,
  query as fireQuery,
  where,
  limit,
  orderBy,
  getDocs,
  postToJSON,
} from "../../lib/firebase";

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDocs = await getUserWithUsername(username);

  if (!userDocs) {
    return {
      notFound: true,
    };
  }
  let userArr = [];
  await userDocs.forEach((document) => {
    userArr.push(document);
  });

  let user = null;
  let posts = null;

  if (userDocs) {
    if (!userArr[0]) {
      return {
        notFound: true,
      };
    }
    user = userArr[0].data();
    const postsQuery = fireQuery(
      collection(userArr[0].ref, "posts"),
      where("published", "==", true),
      limit(5),
      orderBy("createdAt", "desc")
    );
    posts = await (await getDocs(postsQuery)).docs.map(postToJSON);
  }

  return {
    props: { user, posts },
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}

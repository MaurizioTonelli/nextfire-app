import Image from "next/image";

export default function UserProfile({ user }) {
  return (
    user && (
      <div className="box-center">
        <Image
          src={user.photoURL}
          alt="profile"
          width={"50px"}
          height={"50px"}
        />
        <p>
          <i>@{user.username}</i>
        </p>
        <h1>{user.displayName}</h1>
      </div>
    )
  );
}

export default function LogIn() {
  return (
    <main>
      <a onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}>Continue with Google</a>
      <a onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}>Continue with GitHub</a>
      <a onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}>Continue with Twitter</a>
    </main>
  );
}
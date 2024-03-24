import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="hero min-h-screen" style={{backgroundImage: 'url(https://images.pexels.com/photos/933964/pexels-photo-933964.jpeg)'}}>
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Welcome to SUConnect!</h1>
          <p className="mb-5">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
          <button className="btn btn-primary mr-4">
            <Link href="/login">
              Login
            </Link>
          </button>
          <button className="btn btn-primary ml-4">
            <Link href="/register">
              Register
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="hero min-h-screen" style={{backgroundImage: 'url(https://images.pexels.com/photos/933964/pexels-photo-933964.jpeg)'}}>
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Welcome to SUVerse!</h1>
          <p className="mb-5 font-medium">SUVerse is your dedicated space for connecting with fellow Sabancı University members, engaging in academic discussions, and fostering a sense of community within our university.</p>
          <p className="mb-5 font-medium">Ready to dive in? Log in or register now to start exploring, networking, and contributing to the vibrant Sabancı University community on SUVerse.</p>
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
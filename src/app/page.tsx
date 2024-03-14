import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="hero min-h-screen" style={{backgroundImage: 'url()'}}>
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Welcome to SUConnect!</h1>
          <p className="mb-5">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
          <button className="btn btn-primary">
            <Link href="/login">
              Get Started
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
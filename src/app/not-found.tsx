"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const NotFoundPage = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-xl mb-4">Sorry, the page you are looking for does not exist.</p>
            <div>
                <button
                    onClick={() => router.back()}
                    className="btn btn-primary mr-2"
                >
                    Go Back
                </button>
                <Link
                    href="/home"
                    className="btn btn-secondary"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;

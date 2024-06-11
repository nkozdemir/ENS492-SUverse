"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UserVerificationProps {
  token: string;
}

const UserVerification: React.FC<UserVerificationProps> = ({ token }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Call your API to verify the user
    // This is just a placeholder, replace with your actual API call
    fetch(`/api/verify?token=${token}`, {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 200) {
        setIsVerified(true);
      } else {
        // Handle verification failure
        setErrorMessage(data.message);
      }
    });
}, [token]);

    if (isVerified) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <p>Your account is successfully verified!</p>
              <br />
              <button className="btn btn-primary mr-4">
                <Link href="/login">
                  Login
                </Link>
              </button>
            </div>
        );
  } else if (errorMessage) {
    return <p>{errorMessage}</p>;
  } else {
    return <p>Verifying your account...</p>;
  }
};

export default UserVerification;
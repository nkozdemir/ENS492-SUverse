"use client";

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import Toast from '@/components/toast';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      password: Yup.string()
        .required('Required'),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  interface LoginValues {
    email: string;
    password: string;
  }
  
  async function handleSubmit(values: LoginValues) {
    //console.log(values);
    try {
      // Check if the email exists and is verified before attempting login
      const userExistsRes = await fetch('/api/login/checkVerification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });

      const userExistsData = await userExistsRes.json();
      console.log(userExistsData);

      if (userExistsData.status === 404) {
        // If the user does not exist, display an error message
        Toast('err', 'Invalid email or password.');
        return;
      }
  
      if (userExistsData.status === 200 && userExistsData.data.isVerified === false) {
        // If the user exists but is not verified, display an error message
        Toast('err', 'Your account is not verified. Please verify your email address.');
        formik.setSubmitting(false);
        return;
      }

      if(userExistsData.status === 204){
        Toast('err', 'Please register again and verify your email.');
        formik.setSubmitting(false);
        return;
      }

      const res = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      
      if (!res?.ok) {
        //console.error(res?.error);
        if (res?.error?.startsWith('CredentialsSignin')) Toast('err', 'Invalid email or password.');
        else Toast('err', 'An error occurred.');
        formik.setSubmitting(false);
      } 
      else router.replace('/home');
    } catch (error) {
      //console.error("Error during login:", error);
      Toast('err', 'Internal server error.');
    } finally {
      formik.setSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold lg:mb-8 mb-4 p-4">
        <Link href={'/'}>
          Welcome to the SUverse!
        </Link>
      </h2>
      <div className="shadow-lg rounded lg:p-8 p-4 mb-4 w-auto bg-base-200">
        <div>
          <h2 className="text-3xl font-bold mb-12">Login</h2>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className='mb-8'>
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <input 
              type="text"
              required
              id='email'
              name='email'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="Enter your email address" 
              className={`input ${formik.touched.email && formik.errors.email ? 'input-error' : 'input-primary'} input-bordered w-full max-w-xs`}
              disabled={formik.isSubmitting} 
            />
            {formik.touched.email && formik.errors.email ? (
              <div className='label'>
                <div className="label-text-alt text-error">{formik.errors.email}</div>
              </div>
            ) : null}
          </div>
          <div className='mb-8'>
            <div className="label">
              <span className="label-text">Password</span>
            </div>
            <input 
              type="password"
              required
              id='password'
              name='password'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              placeholder="Enter your password" 
              className={`input ${formik.touched.password && formik.errors.password ? 'input-error' : 'input-primary'} input-bordered w-full max-w-xs`}
              disabled={formik.isSubmitting}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className='label'>
                <div className="label-text-alt text-error">{formik.errors.password}</div>
              </div>
            ) : null}
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {formik.isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">&#9696;</span>
                  Logging in
                </>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>
        <p className='flex justify-center items-center mt-8'>
          Don&apos;t have an account?
          <Link href="/register" className="text-primary ml-1">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

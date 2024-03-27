"use client";

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Toast from '@/components/toast';
import Link from 'next/link';

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  tag: string;
}

export default function RegistrationForm() {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      tag: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Required')
        .test(
          'is-sabanci-email',
          'Email must be a @sabanciuniv.edu address',
          (value) => {
            return value.endsWith('@sabanciuniv.edu') || value.endsWith('@alumni.sabanciuniv.edu');
          }
        ),
      password: Yup.string().min(8, 'Must be 8 characters or more').required('Required'),
      tag: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  async function handleSubmit(values: RegisterValues) {
    //console.log(values);
    try {
        const res = await fetch(`api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });
        
        if (res.status === 201) {
            Toast('ok', 'User registered successfully.');
            router.push('/login');
        } 
        else Toast('err', 'An error occurred.');
    } catch (err) {
        //console.error("Error during registration:", err);
        Toast('err', 'Internal server error.');
    } finally {
        formik.resetForm();
    }
  }

  return (
    <div className="w-96 shadow-lg rounded p-8 mb-4">
        <div>
            <h2 className="text-3xl font-bold mb-12">Register</h2>
        </div>
        <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
            <div className="label">
                <span className="label-text">Full Name</span>
            </div>
            <input
                type="text"
                id="name"
                name="name"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                placeholder="Enter your full name"
                className={`input ${formik.touched.name && formik.errors.name ? 'input-error' : 'input-primary'} input-bordered w-full max-w-xs`}
                disabled={formik.isSubmitting}
            />
            {formik.touched.name && formik.errors.name ? (
                <div className="label">
                <div className="label-text-alt text-error">{formik.errors.name}</div>
                </div>
            ) : null}
            </div>
            <div className="mb-4">
            <div className="label">
                <span className="label-text">Email</span>
            </div>
            <input
                type="text"
                required
                id="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                placeholder="Enter your email address"
                className={`input ${formik.touched.email && formik.errors.email ? 'input-error' : 'input-primary'} input-bordered w-full max-w-xs`}
                disabled={formik.isSubmitting}
            />
            {formik.touched.email && formik.errors.email ? (
                <div className="label">
                <div className="label-text-alt text-error">{formik.errors.email}</div>
                </div>
            ) : null}
            </div>
            <div className="mb-4">
            <div className="label">
                <span className="label-text">Password</span>
            </div>
            <input
                type="password"
                required
                id="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                placeholder="Enter your password"
                className={`input ${formik.touched.password && formik.errors.password ? 'input-error' : 'input-primary'} input-bordered w-full max-w-xs`}
                disabled={formik.isSubmitting}
            />
            {formik.touched.password && formik.errors.password ? (
                <div className="label">
                <div className="label-text-alt text-error">{formik.errors.password}</div>
                </div>
            ) : null}
            </div>
            <div className="mb-4">
            <div className="label">
                <span className="label-text">Tag</span>
            </div>
            <select
                id="tag"
                name="tag"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.tag}
                className={`select ${formik.touched.tag && formik.errors.tag ? 'select-error' : 'select-primary'} select-bordered w-full max-w-xs`}
                disabled={formik.isSubmitting}
            >
                <option value="">Select a tag</option>
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
                <option value="faculty">Faculty</option>
            </select>
            {formik.touched.tag && formik.errors.tag ? (
                <div className="label">
                <div className="label-text-alt text-error">{formik.errors.tag}</div>
                </div>
            ) : null}
            </div>
            <div className="flex items-center justify-center mt-8">
            <button
                className="btn btn-primary"
                type="submit"
                disabled={formik.isSubmitting || !formik.isValid}
            >
                {formik.isSubmitting ? (
                <>
                    <span className="animate-spin mr-2">&#9696;</span>
                    Registering
                </>
                ) : (
                    'Register'
                )}
            </button>
            </div>
        </form>
        <p className="flex justify-center items-center mt-8">
            Already have an account?
            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 ml-1">
                Login
            </Link>
        </p>
    </div>
  );
};
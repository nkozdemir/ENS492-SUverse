"use client";

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Toast from '@/components/toast';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface PostValues {
  title: string;
  content: string;
}

export default function CreatePost() {
    const router = useRouter();
    const { data: session } = useSession();
  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      categoryId: '65f57fe71baa5b61560511b2',
      attachments: ['attachment1'],
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      content: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  async function handleSubmit(values: PostValues) {
    console.log(values);
    try {
        const res = await fetch(`/api/post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...values,
                userId: session?.user?.id,
            }),
        });
        
        if (res.status === 201) {
            Toast('ok', 'Post created successfully.');
            router.push('/home');
        } 
        else Toast('err', 'An error occurred.');
    } catch (err) {
        //console.error("Error during creating post:", err);
        Toast('err', 'Internal server error.');
    } finally {
        formik.resetForm();
    }
  }

  return (
    <div className="container">
      <h1>Create a Post</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            {...formik.getFieldProps('title')}
          />
          {formik.touched.title && formik.errors.title ? (
            <div className="form-error">{formik.errors.title}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            className="form-control"
            id="content"
            {...formik.getFieldProps('content')}
          />
          {formik.touched.content && formik.errors.content ? (
            <div className="form-error">{formik.errors.content}</div>
          ) : null}
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
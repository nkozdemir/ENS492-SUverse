"use client";

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Toast from '@/components/toast';

interface PostValues {
  title: string;
  content: string;
}

export default function CreatePost() {
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
    //console.log(values);
    try {
        const res = await fetch(`/api/posts/createPost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...values,
            }),
        });
        //console.log('res:', res);

        const data = await res.json();
        //console.log('data:', data);

        if (data.status === 201) 
          Toast('ok', 'Post created successfully.');
        else 
          Toast('err', 'An error occurred.');
    } catch (err) {
        console.error("Error during creating post:", err);
        Toast('err', 'Internal server error.');
    } finally {
        formik.resetForm();
    }
  }

  return (
    <div>
      <h1 className='font-bold text-2xl mt-4 mb-8'>Create a Post</h1>
      <form onSubmit={formik.handleSubmit}>
        <label className="form-control w-full max-w-xs mb-4">
          <div className="label">
            <span className="label-text">Title</span>
          </div>
          <input 
            type="text" 
            placeholder="Type here" 
            className={`input ${formik.touched.title && formik.errors.title ? 'input-error' : 'input-primary'} input-bordered w-full max-w-xs`}
            id='title' 
            {...formik.getFieldProps('title')}
          />
          {formik.touched.title && formik.errors.title ? (
            <div className="label">
              <span className="label-text-alt text-error">{formik.errors.title}</span>
            </div>
          ) : null}
        </label>
        <label className="form-control w-full max-w-xs mb-4">
          <div className="label">
            <span className="label-text">Choose Category</span>
          </div>
          <select className="select select-bordered select-primary">
            <option disabled selected>Pick one</option>
            <option>General Discussion</option>
          </select>
          <div className="label">
            <span className="label-text-alt text-error">Alt label</span>
          </div>
        </label>
        <label className="form-control mb-8">
          <div className="label">
            <span className="label-text">Content</span>
          </div>
          <textarea 
            className={`textarea ${formik.touched.content && formik.errors.content ? 'textarea-error' : 'textarea-primary'} textarea-bordered w-full max-w-xs h-24`}
            id='content'
            {...formik.getFieldProps('content')}
            placeholder="Type here">
          </textarea>
          {formik.touched.content && formik.errors.content ? (
            <div className="label">
              <span className="label-text-alt text-error">{formik.errors.content}</span>
            </div>
          ) : null}
        </label>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <>
              <span className="animate-spin mr-2">&#9696;</span>
              Creating Post
            </>
          ) : (
            'Submit'
          )}
        </button>
      </form>
    </div>
  );
}
"use client";

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Toast from '@/components/toast';
import { useEffect, useState } from 'react';
import { fetchCategories } from '@/lib/api';
import { CategoryValues } from '@/types/interfaces';
import { useRouter } from 'next/navigation';

interface PostValues {
  title: string;
  content: string;
}

export default function CreatePost() {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      categoryId: '',
      attachments: ['default'],
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      content: Yup.string().required('Required'),
      categoryId: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  const router = useRouter();

  async function handleSubmit(values: PostValues) {
    //console.log('Form values:', values);
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

      const data = await res.json();
      console.log('Create post response:', data);

      if (data.status === 201) {
        Toast('ok', 'Post created successfully.');
        // Redirect to post page
        router.push(`/post/${data.data.id}`);
      }
      else Toast('err', 'An error occurred.');
    } catch (err) {
      console.error("Error during creating post:", err);
      Toast('err', 'Internal server error.');
    } finally {
      formik.resetForm();
    }
  }
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCategories();
      setCategories(data);
      setLoadingCategories(false);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className='font-bold text-2xl mb-4'>Create Post</h1>
      <form onSubmit={formik.handleSubmit} className='p-4 rounded-lg shadow-lg bg-base-200'>
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
            {loadingCategories && (
              <span className="loading loading-spinner loading-sm"></span>
            )}
          </div>
          <select 
            className={`select select-bordered w-full max-w-xs ${formik.touched.categoryId && formik.errors.categoryId ? 'select-error' : 'select-primary'}`}
            id='categoryId'
            {...formik.getFieldProps('categoryId')}
            disabled={loadingCategories || categories.length === 0}
          >
            <option disabled selected value=''>Select Category</option>
            {categories.map((category: CategoryValues) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          {formik.touched.categoryId && formik.errors.categoryId ? (
            <div className="label">
              <span className="label-text-alt text-error">{formik.errors.categoryId}</span>
            </div>
          ) : null}
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
          className="btn btn-primary lg:w-auto w-full"
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
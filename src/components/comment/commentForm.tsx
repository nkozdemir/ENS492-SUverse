"use client";

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Toast from '../toast';

interface CommentFormProps {
    postId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
    return (
        <div className="bg-base-200 rounded p-6">
            <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Add a Comment</h2>
            <Formik
                initialValues={{ content: '', attachments: [] }}
                validationSchema={Yup.object({
                content: Yup.string().required('Content is required'),
                })}
                onSubmit={async (values, { resetForm, setSubmitting }) => {
                    try {
                        const res = await fetch(`/api/comments/createComment`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                postId: postId,
                                content: values.content,
                                attachments: values.attachments,
                            }),
                        });
                        const data = await res.json();
                        console.log('Add comment response:', data);
                        if (data.status === 201) {
                            Toast('ok', 'Comment added successfully.');
                            resetForm();
                        }
                        else Toast('err', 'Failed to add comment.');
                        setSubmitting(false);
                    } catch (error) {
                        console.error('Error adding comment:', error);
                        Toast('err', 'Internal server error.');
                    }
                }}
            >
                {({ isValid, dirty, isSubmitting }) => (
                    <Form>
                        <label className="form-control">
                        <div className="label">
                            <span className="label-text">Your comment</span>
                        </div>
                        <Field
                            as="textarea"
                            id="content"
                            name="content"
                            rows="4"
                            className="textarea textarea-bordered h-24"
                            placeholder="Enter your comment..."
                        />
                        <ErrorMessage name="content">
                            {(msg) => (
                            <div className="label">
                                <span className="label-text-alt text-red-500">{msg}</span>
                            </div>
                            )}
                        </ErrorMessage>
                        </label>
                        <button
                        type="submit"
                        className={`btn btn-primary mt-4 ${!(isValid && dirty) ? 'cursor-not-allowed opacity-50' : ''}`}
                        disabled={!(isValid && dirty) || isSubmitting}
                        >
                        {isSubmitting ? (
                            <>
                                Submitting
                                <span className="animate-spin mr-2">&#9696;</span>
                            </>
                        ) : (
                            'Submit'
                        )}
                        </button>
                    </Form>
                )}
            </Formik>
            </div>
        </div>
    );
};

export default CommentForm;
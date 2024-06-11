"use client";

import { useEffect, useState } from 'react';
import Toast from '@/components/toast';
import { CommentValues, PostDetailValues } from '@/types/interfaces';
import Link from 'next/link';
import { FaArrowRight } from "react-icons/fa";

interface SearchResults {
    posts: PostDetailValues[];
    comments: CommentValues[];
    users: {
        id: number;
        name: string;
        username: string;
        profilePic: string;
    }[];
    categories: {
        id: number;
        name: string;
    }[];
}

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ posts: [], comments: [], users: [], categories: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      const fetchSearchResults = async () => {
          if (query.length > 2) {
              try {
                  setLoading(true);
                  const res = await fetch(`/api/search?query=${query}`);
                  const data = await res.json();
                  //console.log('Search response:', data);
                  if (data.status === 200)
                      setResults({
                          posts: data.data.posts,
                          comments: data.data.comments,
                          users: data.data.users,
                          categories: data.data.categories,
                      });
                  else {
                      //console.error('Error fetching search results:', data.message);
                  }
              } catch (err) {
                  //console.error('Internal server error:', err);
                  Toast('err', 'Internal server error.');
              } finally {
                  setLoading(false);
              }
          } else {
              setResults({ posts: [], comments: [], users: [], categories: [] });
          }
      };

      fetchSearchResults();
  }, [query]);

  return (
    <div className="container mx-auto">
        <div>
            <h1 className="text-2xl font-bold mb-4">Search</h1>
            <label className="input input-bordered input-primary flex items-center gap-2 mb-8">
                <input 
                    type="text" 
                    className="grow" 
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)} 
                />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
            </label>
        </div>

        {loading ? (
            <div className="mt-8 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        ) : (results.comments.length > 0 || results.posts.length > 0 || results.users.length > 0 || results.categories.length > 0) ? (
            <div className="mt-8">
                {results.posts.length > 0 && (
                   <>
                        <h2 className="text-xl font-semibold mb-4">Posts</h2>
                        <div>
                            <ul className='lg:space-y-4 space-y-2'>
                                {results.posts.map((post) => (
                                    <div key={post.id} className="rounded-lg shadow-lg bg-base-200 p-4 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold">{post.title}</h3>
                                            <p className="text-sm text-gray-500">@{post.user.username}</p>
                                        </div>
                                        <Link href={`/post/${post.id}`} className='btn btn-info btn-circle'>
                                            <FaArrowRight size={20} />
                                        </Link>
                                    </div>
                                ))}
                            </ul>
                        </div>
                        <div className="divider"></div>
                    </>
                )}

                {results.comments.length > 0 && (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Comments</h2>
                        <div>
                            <ul className='lg:space-y-4 space-y-2'>
                                {results.comments.map((comment) => (
                                    <div key={comment.id} className="rounded-lg shadow-lg bg-base-200 p-4 flex items-center justify-between">
                                        <div>
                                            <div className="text-lg font-semibold">{comment.content}</div>
                                            <p className="text-sm text-gray-500">@{comment.user.username}</p>
                                        </div>
                                        <Link href={`/post/${comment.postId}`} className='btn btn-info btn-circle'>
                                            <FaArrowRight size={20} />
                                        </Link>
                                    </div>
                                ))}
                            </ul>
                        </div>
                        <div className="divider"></div>
                    </>
                )}

                {results.users.length > 0 && (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Users</h2>
                        <div>
                            <ul className='lg:space-y-4 space-y-2'>
                                {results.users.map((user) => (
                                    <div key={user.id} className="rounded-lg shadow-lg bg-base-200 p-4 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold">{user.name}</h3>
                                            <p className="text-sm text-gray-500">@{user.username}</p>
                                        </div>
                                        <Link href={`/user/${user.id}`} className='btn btn-info btn-circle'>
                                            <FaArrowRight size={20} />
                                        </Link>
                                    </div>
                                ))}
                            </ul>
                        </div>
                        <div className="divider"></div>
                    </>
                )}

                {results.categories.length > 0 && (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Categories</h2>
                        <div>
                            <ul className='lg:space-y-4 space-y-2'>
                                {results.categories.map((category) => (
                                    <div key={category.id} className="rounded-lg shadow-lg bg-base-200 p-4 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold">{category.name}</h3>
                                        </div>
                                        <Link href={`/category/${category.id}/${category.name}`} className='btn btn-info btn-circle'>
                                            <FaArrowRight size={20} />
                                        </Link>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </div>
        ) : (
            <div className="mt-8 flex items-center justify-center">No results found.</div>
        )}
    </div>
  );
};

export default SearchPage;

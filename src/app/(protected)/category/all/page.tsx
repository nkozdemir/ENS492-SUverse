"use client";

import { fetchCategories } from "@/lib/api";
import { useEffect, useState } from "react";
import { CategoryValues } from "@/types/interfaces";
import Link from "next/link";

export default function CategoryAll() {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchCategories();
            setCategories(data);
            setLoadingCategories(false);
        };
        fetchData();
    }, []);
    
    return (
        <>
            <h1 className="font-bold text-2xl mt-4 mb-8">All Categories</h1>
            {loadingCategories ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(10)].map((_, index) => (
                        <div key={index} className="skeleton w-full rounded-lg shadow-lg p-4 h-20"></div>
                    ))}
                </div>
            ) : categories.length === 0 ? (
                <h1>No categories found.</h1>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category: CategoryValues) => (
                        <div key={category.id} className="cursor-pointer bg-base-200 rounded-lg shadow-lg p-4 transition duration-300 ease-in-out transform hover:scale-105">
                            <Link href={`/category/${category.id}/${category.name}`} className="block">
                                <h2 className="text-lg font-semibold mb-2">{category.name}</h2>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

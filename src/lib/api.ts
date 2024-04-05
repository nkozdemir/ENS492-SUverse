import Toast from "@/components/toast";

export async function fetchCategories() {
    try {
        const res = await fetch(`/api/categories/getAllCategories`);
        const data = await res.json();
        console.log('Fetch categories response:', data);
    
        if (data.status === 200) return data.data;
        else if (data.status === 404) {
            Toast('err', 'No categories found.');
            return [];
        }
        else {
            Toast('err', 'An error occurred.');
            return [];
        }
    } catch (err) {
        console.error("Error during fetching categories:", err);
        Toast('err', 'Internal server error.');
        return [];
    }
}

export async function fetchUserLikes(userId: string) {
    try {
        const res = await fetch(`/api/posts/get/liked?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        console.log('Fetch liked posts response:', data);
        if (data.status === 200) {
            const userLikes = data.data;
            //console.log('Liked posts:', userLikes);
            return userLikes;
        } else {
            if (data.status === 404) return [];
            else Toast('err', 'An error occurred.');
        }
    } catch (error) {
        console.error('Error during fetching liked posts:', error);
        Toast('err', 'Internal server error.');
    }
}
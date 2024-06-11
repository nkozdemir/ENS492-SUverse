import Toast from "@/components/toast";

export async function fetchCategories() {
    try {
        const res = await fetch(`/api/categories/getAllCategories`);
        const data = await res.json();
        //console.log('Fetch categories response:', data);
    
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
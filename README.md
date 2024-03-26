This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## API Reference

### Routes

#### Create Post

```http
  POST http://localhost:3000/api/posts/createPost
```

##### Request Body

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `categoryId` | `int` | **Required**. Post category |
| `title`  | `string` | **Required**. Post title |
| `content`  | `string` | **Required**. Post content |
| `attachments`  | `string array` | **Required**. Post attachments |

##### Example Response

```json
{
    "status": 201,
    "message": "Post created",
    "data": ,
}
```

#### Delete Post

```http
  POST http://localhost:3000/api/posts/deletePost
```

##### Example Response

```json
{
    "status": 200,
    "message": "Post deleted",
    "data": ,
}
```

##### Request Body

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `postId`  | `objectId` | **Required**. Post id |

#### Get All Posts

```http
  GET http://localhost:3000/api/posts/getAllPosts
```

##### Example Response

```json
{
    "status": 200,
    "message": "Posts found",
    "data": ,
}
```

#### Get All Category Posts

```http
  POST http://localhost:3000/api/posts/getAllCategoryPosts
```

##### Request Body

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `categoryId`  | `objectId` | **Required**. Category id |

##### Example Response

```json
{
    "status": 200,
    "message": "All posts of a category",
    "data": ,
}
```

#### Get All Categories

```http
  GET http://localhost:3000/api/categories/getAllCategories
```

##### Example Response

```json
{
    "status": 200,
    "message": "Categories found",
    "data": ,
}
```
#### Create Post Like

```http
  POST http://localhost:3000/api/posts/createLike
```

##### Request Body

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `postId`  | `objectId` | **Required**. Post id |

##### Example Response

```json
{
    "status": 201,
    "message": "Like created",
    "data": ,
}
```

#### Delete Post Like

```http
  POST http://localhost:3000/api/posts/deleteLike
```

##### Request Body

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `postId`  | `objectId` | **Required**. Post id |

##### Example Response

```json
{
    "status": 200,
    "message": "Like deleted",
    "data": ,
}
```
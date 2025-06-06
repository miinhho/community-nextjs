import { findPostsByPage } from "@/lib/actions/post.actions";

export default async function PostsPage() {
  const posts = await findPostsByPage({});

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
      <h1 className="text-4xl font-bold mb-8 text-[#333333]">
        Posts
      </h1>
      <ul className="max-w-2xl space-y-4">
        {posts.map((post) => (
          <li key={post.id}>
            <span className="text-sm text-gray-600 ml-2">
              by {post.author?.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
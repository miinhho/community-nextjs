import { createPost } from '@/lib/actions/post.actions';
import { auth } from '@/lib/auth';
import Form from 'next/form';

export default async function NewPost() {
  const session = await auth();

  async function onFormAction(formData: FormData) {
    'use server';

    const content = formData.get('content') as string;
    const user = session?.user;
    if (user === null) {
      // TODO : 유저가 탐지되지 않을 시 오류처리
      // 기본적으로 middleware 을 통해 포스트 관련 작업은 다른 유저가 건드릴 수 없도록 해야함
      // 다만 다른 유저가 건드렸고, 유저가 탐지되지 않을 시 오류 처리를 해야함
      return;
    }

    // TODO : 유저 기능 추가를 통해서 userId 가 1 이 아닌 현재 유저의 아이디로 표시되도록
    await createPost({
      content,
      authorId: user!.id!,
    });
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <Form action={onFormAction} className="space-y-6">
        <div>
          <label htmlFor='title' className="block text-lg mb-2">
            Title
          </label>
          <input
            type='text'
            id='title'
            name='title'
            placeholder='Enter yout post title'
            className='w-full px-4 py-2 border rounded-lg'
          />
        </div>
        <div>
          <label htmlFor='content' className='block text-lg mb-2'>
            Content
          </label>
          <textarea
            id='content'
            name='content'
            placeholder='Write your post content here...'
            rows={6}
            className='w-full px-4 py-2 border rounded-lg'
          />
        </div>
        <button
          type='submit'
          className='w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600'
        >
          Create Post
        </button>
      </Form>
    </div>
  )
}
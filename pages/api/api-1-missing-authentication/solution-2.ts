import { NextApiRequest, NextApiResponse } from 'next';
import { getBlogPosts } from '../../../database/blogPosts';
import { getUserByValidSessionToken } from '../../../database/users';

export default async function missingAuthenticationHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const sessionToken = request.cookies.sessionToken;

  if (!sessionToken) {
    response.status(401).json({
      error: 'Session token not provided',
    });
    return;
  }

  const user = await getUserByValidSessionToken(sessionToken);

  if (!user) {
    response.status(401).json({
      error: 'Session token not valid',
    });
    return;
  }

  const allBlogPosts = await getBlogPosts();

  const blogPosts = allBlogPosts.filter((blogPost) => {
    return blogPost.isPublished || blogPost.userId === user.id;
  });

  response.status(200).json({
    blogPosts: blogPosts,
  });
}

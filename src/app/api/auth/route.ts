import { message } from 'antd';

export async function POST(request: Request) {
  const res = await request.json();
  const accessToken = res.accessToken;
  const refreshToken = res.refreshToken;
  if (!accessToken) {
    return Response.json(
      { message: 'Không tồn tại accessToken' },
      {
        status: 401,
      }
    );
  }
  return await Response.json(
    { res },
    {
      status: 200,
      headers: {
        'Set-Cookie': [
          `accessToken=${accessToken}; Path=/;`,
          `refreshToken=${refreshToken}; Path=/;`,
        ].join(', '),
      },
    }
  );
}

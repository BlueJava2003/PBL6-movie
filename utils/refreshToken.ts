import Cookies from 'js-cookie';

export async function refreshToken() {
  const refreshToken = Cookies.get('refreshToken');
  console.log('🚀 ~ refreshToken ~ refreshToken:', refreshToken);

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${process.env.customURL}/auth/refreshToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log('🚀 ~ refreshToken ~ data:', data);
    await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({
        accessToken: data?.data.accessToken,
        refreshToken: data?.data.refresh_token,
      }),
    });

    return data?.data.accessToken;
  } else {
    throw new Error('Failed to refresh token');
  }
}

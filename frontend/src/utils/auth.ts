/**
 * ログイン中のユーザーIDのみを取得する
 * @returns {Promise<string>} user_id
 */
export const fetchUserId = async () => {
  try {
    const response = await fetch('/api/v1/auth/me');

    if (!response.ok) {
      throw new Error('ネットワークエラーが発生しました');
    }

    const data = await response.json();

    // オブジェクトから user_id のみを取り出して返す
    return data.user_id;
  } catch (error) {
    console.error('ユーザーIDの取得に失敗しました:', error);
    throw error;
  }
};

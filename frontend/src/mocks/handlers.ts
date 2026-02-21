import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/v1/card/:user_name', ({ params }) => {
    const { user_name } = params;

    return HttpResponse.json({
      user_info: {
        avatar_url:
          'https://avatars.githubusercontent.com/t/16250516?s=116&v=4',
        user_name: String(user_name),
        display_name: 'Tech Taro',
        github_joined_at: '2020-01-01',
        bio: 'サンプルテキスト',
        company: 'Tech Company',
        location: 'Tokyo, Japan',
        website: 'https://example.com',
        social_accounts: [
          'https://twitter.example.com/tech_taro',
          'https://github.example.com/tech-taro',
        ],
        is_self: true,
      },
      card_info: {
        alias_title: '静寂のナイトウォッチ',
        technical_level: 45,
        last_updated_at: '2026-02-17T14:30:00Z',
        stats: {
          repo_count: 25,
          total_bytes: 850000, // ← 修正
        },
        languages: [
          {
            name: 'TypeScript',
            bytes: 500000, // ← 修正
          },
          {
            name: 'Go',
            bytes: 650000, // ← 修正
          },
          { name: 'Rust', bytes: 300000 }, // ← 修正
        ],
        activity_score: 85,
        charm_score: 70,
      },
    });
  }),

  http.post('/api/v1/cards/:id/update', async ({ params }) => {
    const { id } = params;

    await new Promise((resolve) =>
      setTimeout(resolve, (Math.random() * (15 - 10) + 10) * 1000),
    );

    return HttpResponse.json({
      status: id === '1234567890',
    });
  }),

  http.get('/api/v1/cards/:user_name/qr', () => {
    return HttpResponse.json({
      status: 'success',
      qr_image_url:
        'https://lh3.googleusercontent.com/rd-d/ALs6j_HnRrOG8TAA_gFQbjIXM9PebopGL0ycktPWyAErKy7-f7ZJTKlzY8Y8PS0n1DSw8B2eykePQW58DOyoP-TKaJg4sRl1rVoff_k5bf5socE04icBjmVv1D8iJesGgB5ei3zp-DS-44x0AnJbn0t0WDwXTlS-xI1vaY7TFsEiwYvw4FBcTMRJRQL5UTdoqFXMfF3RoR0wf2_MPkfr9KajsNoF5IOaRXhmLxcBEdVMoL7Z5ekJmk27BXmp3a8BbGDztrGS6_miN9Qawd8laApDQHg92UKEr-sDpNeUMrQH40iqED5lwltGvKDnj9zJKm-tOsjtWVSAs5fSAAN_8y2fMKWHylyP-KsF4UF7wbx9cSVJRyhOouZS6_IQJLtOf0swTTHNwOu8xp87-FFpFVxiVo4-fFayGA79O3l8Wrxsxc15r6txQtvzl6dXE714fm_fa4SbxexeVvfG8EAFjZ9zO1F3T1bvIPoW5bD8pbIiRfCA-pmdxsIzYstpvtspHvSn23rky9j24Q4I9Vmg2FlPdizAD-9WMub4TydbZoZZEkzLsInYsxirNnfA0lM7UzpJBaxM9ncS8BxKSjD3wt9RQc8R1-kNEUbuts2imALOMLiNSjEgbr1csJFZIDnAiDIUaxVvbaShAvDgl2Xg-mAiP04j1Im7rTEI5zy7zfFnji1HIAi5ep8_3hwC2aUBSNzhlLAXm8LUl4QiyXt1FpHdKBiJX32g3t4mIRTDu0TK7ArLLHtolddL7wC8_BLycsgZ9G5PaVN991wLIDyyI9svMLbS2annYuavx3vQnNXdLtoNchNBllNpsMvUcaypqiAZos-WXEkgGGhNjR1sNh5mg8qNr3Srm0VlRZAzMp8dKTGe4dWI0PeDVWRa6jnFu7vrKAP_b1nv6H8hjwovVqq1sPXp08GnFpJyZsmkwMg8c1m0g4FrN-82gD3sLaDiMwxRi2laMZ_dcqmoSjxofBcykGFK55kaKLjgyZjSPsAagsmOkbCtkIWaQunEJ9m8MAm4RsHL9X-xSjC_csE7zQwpMDX11YTzjrEADaS94Q',
    });
  }),

  http.get('/api/v1/auth/me', () => {
    return HttpResponse.json({
      user_id: '1234567890',
      user_name: 'user_name',
      avatar_url: 'https://avatars.githubusercontent.com/t/16250516?s=116&v=4',
    });
  }),
];

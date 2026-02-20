import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/v1/card/:user_name", ({ params }) => {
    const { user_name } = params;

    return HttpResponse.json({
      user_info: {
        avatar_url: "https://avatars.githubusercontent.com/t/16250516?s=116&v=4",
        user_name: user_name,
        display_name: "Tech Taro",
        github_joined_at: "2020-01-01",
        bio: "サンプルテキスト",
        company: null,
        location: null,
        website: "https://example.com",
        social_accounts: [],
        is_self: true
      },
      card_info: {
        alias_title: "静寂のナイトウォッチ",
        technical_level: 45,
        last_updated_at: "2026-02-17T14:30:00Z",
        stats: {
          repo_count: 25,
          total_bytes: 850000   // ← 修正
        },
        languages: [
          {
            name: "TypeScript",
            bytes: 500000       // ← 修正
          },
          {
            name: "Go",
            bytes: 350000       // ← 修正
          }
        ],
        activity_score: 85,
        charm_score: 70
      }
    });
  }),

  http.post("/api/v1/cards/:id/update", ({ params }) => {
    const { id } = params;

    return HttpResponse.json({
      status: id === "test"
    });
  }),

  http.get("/api/v1/cards/:user_name/qr", () => {
    return HttpResponse.json({
      status: "success",
      qr_image_url: "https://avatars.githubusercontent.com/t/16250516?s=116&v=4"
    });
  })
];

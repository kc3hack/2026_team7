import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/v1/engineers/:user_name/card", ({ params }) => {
    const { user_name } = params;

    return HttpResponse.json({
      user_info: {
        avatar_url: "https://example.com/avatar.png",
        user_name: user_name,
        display_name: "Tech Taro",
        github_joined_at: "2020-01-01",
        bio: "Passionate about coding and open source. Always eager to learn new technologies and contribute to the community.",
        company: "Tech Corp",
        location: "Tokyo, Japan",
        website: "https://example.com",
        social_accounts: ["https://twitter.com/techtaro", "https://github.com/techtaro"],
        is_self: true,
      },
      card_info: {
        alias_title: "静寂のナイトウォッチ",
        technical_level: 45,
        last_updated_at: "2026-02-17T14:30:00Z",
        stats: {
          repo_count: 25,
          total_char_count: 850000,
        },
        languages: [
          {
            name: "TypeScript",
            char_count: 500000,
          },
          {
            name: "Go",
            char_count: 350000,
          },
        ],
        activity_score: 85,
        charm_score: 70,
      },
    });
  }),


  http.put("/api/v1/cards/:user_name/update", async ({ params }) => {
    const { user_name } = params;

    return HttpResponse.json({
      status: user_name === "techtaro",
    });
  }),

  http.get("/api/v1/cards/:user_name/qr", () => {

    return HttpResponse.json({
      status: "success",
      qr_image_url: `https://avatars.githubusercontent.com/t/16250516?s=116&v=4`,
    });
  }),
];

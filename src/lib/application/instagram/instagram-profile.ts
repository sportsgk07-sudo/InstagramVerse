import {
  buildInstagramHeaders,
  getInstagramSession,
} from "@/lib/application/instagram/instagram-session";
import { ExtractionError } from "@/lib/application/instagram/errors";

interface ProfileResponse {
  data?: {
    user?: {
      username?: string;
      full_name?: string;
      profile_pic_url?: string;
      profile_pic_url_hd?: string;
      is_private?: boolean;
    };
  };
  status?: string;
}

export async function fetchProfilePicture(username: string): Promise<{
  username: string;
  fullName?: string;
  profileUrl: string;
}> {
  const session = await getInstagramSession();
  const referer = `https://www.instagram.com/${username}/`;

  const response = await fetch(
    `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`,
    {
      headers: buildInstagramHeaders(session, { referer }),
      next: { revalidate: 0 },
    }
  );

  const contentType = response.headers.get("content-type") ?? "";
  const text = await response.text();

  if (!response.ok || !contentType.includes("json")) {
    throw new ExtractionError(
      "PROFILE_NOT_FOUND",
      "Could not fetch profile. The account may be private or unavailable.",
      response.status === 404 ? 404 : 422
    );
  }

  let json: ProfileResponse;
  try {
    json = JSON.parse(text) as ProfileResponse;
  } catch {
    throw new ExtractionError(
      "PROFILE_PARSE_ERROR",
      "Failed to parse Instagram profile response",
      502
    );
  }

  const user = json.data?.user;
  const profileUrl = user?.profile_pic_url_hd ?? user?.profile_pic_url;

  if (!user || !profileUrl) {
    throw new ExtractionError(
      "PROFILE_NOT_FOUND",
      "Could not find profile picture. The account may be private.",
      404
    );
  }

  if (user.is_private) {
    throw new ExtractionError(
      "PRIVATE_ACCOUNT",
      "This account is private. Profile pictures cannot be downloaded.",
      403
    );
  }

  return {
    username: user.username ?? username,
    fullName: user.full_name,
    profileUrl,
  };
}

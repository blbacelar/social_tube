import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/encryption";

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const config = await prisma.socialMediaConfig.findUnique({
      where: { userId: user.id },
    });

    if (!config) {
      return NextResponse.json({});
    }

    // Decrypt the values before sending to client
    const decryptedConfig = {
      facebookApiKey:
        config.facebookApiKey && config.facebookApiKeyIv
          ? decrypt(config.facebookApiKey, config.facebookApiKeyIv)
          : "",
      instagramApiKey:
        config.instagramApiKey && config.instagramApiKeyIv
          ? decrypt(config.instagramApiKey, config.instagramApiKeyIv)
          : "",
      linkedinApiKey:
        config.linkedinApiKey && config.linkedinApiKeyIv
          ? decrypt(config.linkedinApiKey, config.linkedinApiKeyIv)
          : "",
    };

    return NextResponse.json(decryptedConfig);
  } catch (error) {
    console.error("Failed to fetch configuration:", error);
    return NextResponse.json(
      { error: "Failed to fetch configuration" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { facebookApiKey, instagramApiKey, linkedinApiKey } =
      await req.json();

    // Encrypt the API keys
    const encryptedFacebook = facebookApiKey ? encrypt(facebookApiKey) : null;
    const encryptedInstagram = instagramApiKey
      ? encrypt(instagramApiKey)
      : null;
    const encryptedLinkedin = linkedinApiKey ? encrypt(linkedinApiKey) : null;

    const config = await prisma.socialMediaConfig.upsert({
      where: { userId: user.id },
      update: {
        facebookApiKey: encryptedFacebook?.encryptedData,
        facebookApiKeyIv: encryptedFacebook?.iv,
        instagramApiKey: encryptedInstagram?.encryptedData,
        instagramApiKeyIv: encryptedInstagram?.iv,
        linkedinApiKey: encryptedLinkedin?.encryptedData,
        linkedinApiKeyIv: encryptedLinkedin?.iv,
      },
      create: {
        userId: user.id,
        facebookApiKey: encryptedFacebook?.encryptedData,
        facebookApiKeyIv: encryptedFacebook?.iv,
        instagramApiKey: encryptedInstagram?.encryptedData,
        instagramApiKeyIv: encryptedInstagram?.iv,
        linkedinApiKey: encryptedLinkedin?.encryptedData,
        linkedinApiKeyIv: encryptedLinkedin?.iv,
      },
    });

    // Return decrypted values to the client
    return NextResponse.json({
      facebookApiKey: facebookApiKey || "",
      instagramApiKey: instagramApiKey || "",
      linkedinApiKey: linkedinApiKey || "",
    });
  } catch (error) {
    console.error("Failed to save configuration:", error);
    return NextResponse.json(
      { error: "Failed to save configuration" },
      { status: 500 }
    );
  }
}

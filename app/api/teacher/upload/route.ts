import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

/*
|--------------------------------------------------------------------------
| Upload configuration
|--------------------------------------------------------------------------
*/

const UPLOAD_CONFIG = {
  VIDEO: {
    resourceType: "video",
    maxSize: 500 * 1024 * 1024, // 500 MB
    maxSizeMB: 500,
    allowedFormats: ["mp4", "webm", "mov", "avi", "mkv"],
  },

  PDF: {
    // Cloudinary stores PDFs as image assets.
    resourceType: "image",
    maxSize: 20 * 1024 * 1024, // 20 MB
    maxSizeMB: 20,
    allowedFormats: ["pdf"],
  },

  IMAGE: {
    resourceType: "image",
    maxSize: 5 * 1024 * 1024, // 5 MB
    maxSizeMB: 5,
    allowedFormats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "gif",
    ],
  },
} as const;

type UploadType = keyof typeof UPLOAD_CONFIG;

/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
| Returns upload rules to the frontend.
|
| This means we don't have to hard-code things like:
| 500 MB / 20 MB / 5 MB
| in multiple frontend files.
*/

export async function GET() {
  return NextResponse.json({
    success: true,
    supportedTypes: UPLOAD_CONFIG,
  });
}

/*
|--------------------------------------------------------------------------
| POST
|--------------------------------------------------------------------------
| Generates secure signed upload parameters.
|
| IMPORTANT:
| The actual file does NOT pass through this API.
|
| Browser
|    ↓
| Cloudinary
|
| This API only creates the signature needed by Cloudinary.
|--------------------------------------------------------------------------
*/

export async function POST(request: Request) {
  try {
    // --------------------------------
    // 1. CHECK LOGIN
    // --------------------------------

    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    // --------------------------------
    // 2. CHECK TEACHER ROLE
    // --------------------------------

    if (user.role !== "TEACHER") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only teachers can upload course files.",
        },
        { status: 403 }
      );
    }

    // --------------------------------
    // 3. READ REQUEST
    // --------------------------------

    const body = await request.json();

    const type = body.type as UploadType;

    if (!type || !(type in UPLOAD_CONFIG)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid upload type. Supported types are VIDEO, PDF and IMAGE.",
        },
        { status: 400 }
      );
    }

    const config = UPLOAD_CONFIG[type];

    // --------------------------------
    // 4. CREATE SAFE STORAGE LOCATION
    // --------------------------------

    const folder =
      `campus-arena/course-content/teacher-${user.id}`;

    /*
     * Generate the public ID on the server.
     *
     * This prevents the browser from deciding arbitrary
     * Cloudinary public IDs.
     */
    const publicId = `asset-${crypto.randomUUID()}`;

    // --------------------------------
    // 5. CREATE SIGNATURE
    // --------------------------------

    const timestamp = Math.floor(
      Date.now() / 1000
    );

    const paramsToSign = {
      folder,
      public_id: publicId,
      timestamp,
    };

    const signature =
      cloudinary.utils.api_sign_request(
        paramsToSign,
        process.env.CLOUDINARY_API_SECRET!
      );

    // --------------------------------
    // 6. CLOUDINARY UPLOAD URL
    // --------------------------------

    const uploadUrl =
      `https://api.cloudinary.com/v1_1/` +
      `${process.env.CLOUDINARY_CLOUD_NAME}/` +
      `${config.resourceType}/upload`;

    // --------------------------------
    // 7. RETURN SIGNED UPLOAD DETAILS
    // --------------------------------

    return NextResponse.json({
      success: true,

      upload: {
        cloudName:
          process.env.CLOUDINARY_CLOUD_NAME,

        apiKey:
          process.env.CLOUDINARY_API_KEY,

        timestamp,

        signature,

        folder,

        publicId,

        resourceType:
          config.resourceType,

        uploadUrl,

        maxSize:
          config.maxSize,

        maxSizeMB:
          config.maxSizeMB,

        allowedFormats:
          config.allowedFormats,
      },
    });
  } catch (error) {
    console.error(
      "Cloudinary signature error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to prepare Cloudinary upload.",
      },
      { status: 500 }
    );
  }
}
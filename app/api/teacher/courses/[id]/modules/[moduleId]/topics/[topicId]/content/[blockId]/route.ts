import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

type Params = {
  params: Promise<{
    id: string;
    moduleId: string;
    topicId: string;
    blockId: string;
  }>;
};

const validTypes = [
  "TEXT",
  "VIDEO",
  "YOUTUBE",
  "PDF",
  "ARTICLE",
  "IMAGE",
  "FUN_FACT",
  "GOOD_TO_KNOW",
  "COMMON_MISTAKE",
];

/*
|--------------------------------------------------------------------------
| Cloudinary helpers
|--------------------------------------------------------------------------
*/

/**
 * Deletes a Cloudinary asset safely.
 *
 * Cloudinary resource types used by Campus Arena:
 *
 * VIDEO → video
 * IMAGE → image
 * PDF   → image
 */
async function deleteCloudinaryAsset(
  publicId: string | null,
  resourceType: string | null
) {
  if (!publicId) {
    return;
  }

  const resource =
    resourceType === "video"
      ? "video"
      : "image";

  const result =
    await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: resource,
        invalidate: true,
      }
    );

  /*
   * "not found" is okay.
   *
   * It means the file is already gone from
   * Cloudinary, so there is nothing left
   * for us to delete.
   */
  if (
    result.result !== "ok" &&
    result.result !== "not found"
  ) {
    throw new Error(
      `Cloudinary deletion failed: ${result.result}`
    );
  }

  return result;
}

/*
|--------------------------------------------------------------------------
| PATCH
|--------------------------------------------------------------------------
| Updates a ContentBlock.
|
| If a new Cloudinary asset replaces an old one:
|
| 1. Update PostgreSQL
| 2. Delete the old Cloudinary asset
|
|--------------------------------------------------------------------------
*/

export async function PATCH(
  request: Request,
  { params }: Params
) {
  try {
    const {
      id,
      moduleId,
      topicId,
      blockId,
    } = await params;

    const courseId = Number(id);
    const moduleIdNumber = Number(moduleId);
    const topicIdNumber = Number(topicId);
    const blockIdNumber = Number(blockId);

    if (
      Number.isNaN(courseId) ||
      Number.isNaN(moduleIdNumber) ||
      Number.isNaN(topicIdNumber) ||
      Number.isNaN(blockIdNumber)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    /*
     * Validate content type.
     */
    if (
      body.type !== undefined &&
      !validTypes.includes(body.type)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid content type",
        },
        { status: 400 }
      );
    }

    /*
     * Find the ContentBlock and make sure
     * it actually belongs to this course/module/topic.
     */
    const block =
      await prisma.contentBlock.findFirst({
        where: {
          id: blockIdNumber,
          topicId: topicIdNumber,
          topic: {
            moduleId: moduleIdNumber,
            module: {
              courseId,
            },
          },
        },
      });

    if (!block) {
      return NextResponse.json(
        {
          success: false,
          message: "Content block not found",
        },
        { status: 404 }
      );
    }

    /*
     * Keep the old Cloudinary information
     * before changing the database record.
     */
    const oldCloudinaryPublicId =
      block.cloudinaryPublicId;

    const oldCloudinaryResourceType =
      block.cloudinaryResourceType;

    /*
     * Determine whether the request is
     * providing a new Cloudinary asset.
     */
    const newCloudinaryPublicId =
      body.cloudinaryPublicId !== undefined
        ? body.cloudinaryPublicId
        : undefined;

    const newCloudinaryResourceType =
      body.cloudinaryResourceType !== undefined
        ? body.cloudinaryResourceType
        : undefined;

    /*
     * Build update data.
     *
     * The explicit union for `type` makes the value
     * compatible with the Prisma ContentType enum
     * without importing ContentType from the
     * generated Prisma client.
     */
    const updateData: {
      type?:
        | "TEXT"
        | "VIDEO"
        | "YOUTUBE"
        | "PDF"
        | "ARTICLE"
        | "IMAGE"
        | "FUN_FACT"
        | "GOOD_TO_KNOW"
        | "COMMON_MISTAKE";

      content?: string | null;
      url?: string | null;
      cloudinaryPublicId?: string | null;
      cloudinaryResourceType?: string | null;
    } = {};

    if (body.type !== undefined) {
      updateData.type = body.type as
        | "TEXT"
        | "VIDEO"
        | "YOUTUBE"
        | "PDF"
        | "ARTICLE"
        | "IMAGE"
        | "FUN_FACT"
        | "GOOD_TO_KNOW"
        | "COMMON_MISTAKE";
    }

    if (body.content !== undefined) {
      updateData.content = body.content;
    }

    if (body.url !== undefined) {
      updateData.url = body.url;
    }

    if (
      newCloudinaryPublicId !== undefined
    ) {
      updateData.cloudinaryPublicId =
        newCloudinaryPublicId || null;
    }

    if (
      newCloudinaryResourceType !== undefined
    ) {
      updateData.cloudinaryResourceType =
        newCloudinaryResourceType || null;
    }

    /*
     * Update PostgreSQL first.
     */
    const updatedBlock =
      await prisma.contentBlock.update({
        where: {
          id: blockIdNumber,
        },
        data: updateData,
      });

    /*
     * If a DIFFERENT Cloudinary asset was supplied,
     * remove the old one.
     */
    const replacingCloudinaryAsset =
      newCloudinaryPublicId !== undefined &&
      oldCloudinaryPublicId &&
      newCloudinaryPublicId !==
        oldCloudinaryPublicId;

    if (replacingCloudinaryAsset) {
      try {
        await deleteCloudinaryAsset(
          oldCloudinaryPublicId,
          oldCloudinaryResourceType
        );
      } catch (cloudinaryError) {
        /*
         * The database already contains the new
         * asset, so don't fail the entire PATCH.
         */
        console.error(
          "Old Cloudinary asset could not be deleted:",
          cloudinaryError
        );
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "Content block updated successfully",
      block: updatedBlock,
    });
  } catch (error) {
    console.error(
      "Update content block error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update content block",
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
| Deletes both:
|
| 1. Cloudinary asset
| 2. PostgreSQL ContentBlock
|
|--------------------------------------------------------------------------
*/

export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    const {
      id,
      moduleId,
      topicId,
      blockId,
    } = await params;

    const courseId = Number(id);
    const moduleIdNumber = Number(moduleId);
    const topicIdNumber = Number(topicId);
    const blockIdNumber = Number(blockId);

    if (
      Number.isNaN(courseId) ||
      Number.isNaN(moduleIdNumber) ||
      Number.isNaN(topicIdNumber) ||
      Number.isNaN(blockIdNumber)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid ID",
        },
        { status: 400 }
      );
    }

    /*
     * Find the block and verify its hierarchy.
     */
    const block =
      await prisma.contentBlock.findFirst({
        where: {
          id: blockIdNumber,
          topicId: topicIdNumber,
          topic: {
            moduleId: moduleIdNumber,
            module: {
              courseId,
            },
          },
        },
      });

    if (!block) {
      return NextResponse.json(
        {
          success: false,
          message: "Content block not found",
        },
        { status: 404 }
      );
    }

    /*
     * Delete Cloudinary asset first.
     *
     * If the Cloudinary asset cannot be deleted,
     * keep the database record.
     */
    if (block.cloudinaryPublicId) {
      try {
        await deleteCloudinaryAsset(
          block.cloudinaryPublicId,
          block.cloudinaryResourceType
        );
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary deletion error:",
          cloudinaryError
        );

        return NextResponse.json(
          {
            success: false,
            message:
              "The file could not be deleted from Cloudinary. The content was not deleted.",
          },
          { status: 500 }
        );
      }
    }

    /*
     * Now delete the PostgreSQL record.
     */
    await prisma.contentBlock.delete({
      where: {
        id: blockIdNumber,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Content block and associated file deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete content block error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete content block",
      },
      { status: 500 }
    );
  }
}
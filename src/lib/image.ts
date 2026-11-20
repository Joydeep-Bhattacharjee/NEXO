/** Profile photo handling: square-crop and shrink in the browser so it fits in local storage. */

export const PHOTO_SIZE = 256;
export const PHOTO_MAX_BYTES = 10 * 1024 * 1024;

export async function toSquarePhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("That isn't an image");
  if (file.size > PHOTO_MAX_BYTES) throw new Error("Use an image under 10 MB");
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = PHOTO_SIZE;
  canvas.height = PHOTO_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Couldn't read that image");
  ctx.drawImage(
    bitmap,
    (bitmap.width - side) / 2,
    (bitmap.height - side) / 2,
    side,
    side,
    0,
    0,
    PHOTO_SIZE,
    PHOTO_SIZE,
  );
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.85);
}

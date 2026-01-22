export const runtime = "edge";

export async function GET() {
  // Intentionally returns extra data for your "Privacy by Design" demo.
  // This is NOT recommended for real apps.
  return Response.json({
    name: "John Doe",
    dob: "1800-01-01",
    address: "123 Main Street",
  });
}

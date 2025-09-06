// This route handles Chrome DevTools requests
// Returns a 404 response to prevent the error message
export function meta() {
  return [
    { title: "Not Found" },
  ];
}

export default function DevTools() {
  // Return null to prevent rendering anything
  // This will result in a 404 response for Chrome DevTools
  return null;
}

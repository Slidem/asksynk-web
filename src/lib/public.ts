export function isOnPublicView() {
  return window.location.pathname.startsWith("/public/");
}

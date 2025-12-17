export default {
    async fetch(request, env, ctx) {
        var url = new URL(request.url)
        // Remove the leading slash to get the target URL
        // e.g., /https://google.com -> https://google.com
        var redirectUrl = url.pathname.substring(1) + url.search

        // Safety check: ensure we actually have a URL to redirect to
        if (!redirectUrl || redirectUrl === '/') {
            // If no path, let the request fall through to the static site (index.html)
            // usually handled by Cloudflare Routes or just return 404/Home if this worker handles everything.
            // But typically for this specific setup where "Root path" is static HTML, 
            // the worker might only trigger on routes or handle the fallback.
            // Given the snippet provided by the user, it blindly redirects. 
            // If the user visits root /, pathname is /, substring(1) is empty.
            // Response.redirect("", 307) might fail.

            // However, strictly following the user's provided snippet:
            return Response.redirect(redirectUrl, 307)
        }

        return Response.redirect(redirectUrl, 307)
    }
}

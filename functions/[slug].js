export async function onRequest({ request, env, params, next }) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return next();

  const url = new URL(request.url);
  const slug = String(params.slug || '').toLowerCase();

  if (url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1);
    return Response.redirect(url, 308);
  }

  const staticAsset = await env.ASSETS.fetch(request);
  if (staticAsset.status !== 404) return staticAsset;
  if (!/^[a-z0-9-]+$/.test(slug)) return staticAsset;

  const projectsUrl = new URL('/projects/projects.json', request.url);
  const projectsResponse = await env.ASSETS.fetch(projectsUrl);
  if (!projectsResponse.ok) return staticAsset;

  const data = await projectsResponse.json();
  const projects = Array.isArray(data) ? data : data.projects || [];
  const project = projects.find((item) => String(item.slug || '').toLowerCase() === slug);
  if (!project) return staticAsset;

  const pageUrl = new URL('/project', request.url);
  const pageResponse = await env.ASSETS.fetch(pageUrl);
  if (!pageResponse.ok) return pageResponse;

  const headers = new Headers(pageResponse.headers);
  headers.set('Content-Type', 'text/html; charset=utf-8');
  headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  return new Response(request.method === 'HEAD' ? null : pageResponse.body, {
    status: 200,
    headers,
  });
}

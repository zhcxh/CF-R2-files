// R2-File-Server with TOKEN auth  (modules 模式，HTML 分离)
import html from './public/index.html';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function checkToken(url, env) {
  const qs = url.searchParams.get('token');
  if (!qs || qs !== env.AUTH_TOKEN)
    return new Response('Unauthorized: token missing or wrong', { status: 401, headers: CORS_HEADERS });
  return null;
}

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const headers = { ...CORS_HEADERS, 'Access-Control-Allow-Origin': url.origin };
    if (req.method === 'OPTIONS') return new Response(null, { headers });

    const authErr = checkToken(url, env);
    if (authErr) return authErr;

    try {
      const { pathname } = url;

      if (pathname === '/' && req.method === 'GET') {
        return new Response(html, { headers: { ...headers, 'Content-Type': 'text/html;charset=utf-8' } });
      }

      if (pathname === '/files' && req.method === 'GET') {
        const list = await env.MY_BUCKET.list();
        const files = list.objects.map(o => ({
          name: o.key,
          size: o.size,
          uploadedAt: o.uploaded.toISOString(),
          icon: iconOf(o.key)
        }));
        return new Response(JSON.stringify(files), { headers: { ...headers, 'Content-Type': 'application/json' } });
      }

      if (pathname.startsWith('/files/') && req.method === 'GET') {
        const key = decodeURIComponent(pathname.slice('/files/'.length));
        const obj = await env.MY_BUCKET.get(key);
        if (!obj) return new Response('Not Found', { status: 404, headers });
        const h = new Headers();
        obj.writeHttpMetadata(h);
        h.set('etag', obj.httpEtag);
        h.set('Content-Disposition', `attachment; filename="${key}"`);
        return new Response(obj.body, { headers: h });
      }

      if (pathname === '/upload' && req.method === 'POST') {
        const fd = await req.formData();
        const file = fd.get('file');
        if (!file) return new Response('Missing file', { status: 400, headers });
        if (file.size > 100 * 1024 * 1024) return new Response('File too large >100MB', { status: 400, headers });
        await env.MY_BUCKET.put(file.name, file.stream(), {
          httpMetadata: { contentType: file.type, contentLength: file.size }
        });
        return new Response(JSON.stringify({ message: 'OK', name: file.name, size: file.size }), {
          headers: { ...headers, 'Content-Type': 'application/json' }
        });
      }

      if (pathname.startsWith('/files/') && req.method === 'DELETE') {
        const key = decodeURIComponent(pathname.slice('/files/'.length));
        await env.MY_BUCKET.delete(key);
        return new Response(JSON.stringify({ message: 'Deleted' }), { headers: { ...headers, 'Content-Type': 'application/json' } });
      }

      return new Response('Not Found', { status: 404, headers });
    } catch (e) {
      return new Response('Server Error: ' + e.message, { status: 500, headers });
    }
  }
};

function iconOf(name) {
  const ext = name.split('.').pop().toLowerCase();
  const map = { pdf: '📄', doc: '📝', docx: '📝', xls: '📊', xlsx: '📊', ppt: '📽️', pptx: '📽️', jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', mp3: '🎵', mp4: '🎬', zip: '📦', rar: '📦', txt: '📃', js: '💻', html: '🌐', css: '🎨' };
  return map[ext] || '📎';
}
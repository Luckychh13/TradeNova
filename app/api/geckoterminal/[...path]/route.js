async function proxyRequest(request) {
  const { pathname, search } = new URL(request.url)
  const targetPath = pathname.replace('/api/geckoterminal', '')
  const targetUrl = `https://api.geckoterminal.com/api/v2${targetPath}${search}`

  const response = await fetch(targetUrl, {
    method: request.method,
    headers: {
      accept: 'application/json',
      ...(request.headers.get('content-type')
        ? { 'content-type': request.headers.get('content-type') }
        : {}),
    },
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text(),
  })

  const data = await response.text()

  return new Response(data, {
    status: response.status,
    headers: {
      'content-type': response.headers.get('content-type') || 'application/json',
      'cache-control': 'no-store',
      'access-control-allow-origin': '*',
    },
  })
}

export async function GET(request) {
  return proxyRequest(request)
}

export async function POST(request) {
  return proxyRequest(request)
}

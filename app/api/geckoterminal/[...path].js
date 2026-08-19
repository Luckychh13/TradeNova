export async function GET(request) {
  const { pathname, search } = new URL(request.url)
  const targetPath = pathname.replace('/api/geckoterminal', '')

  if (!/^\/networks\/[A-Za-z0-9_-]+\/(pools|tokens)\/[A-Za-z0-9_.:-]+/.test(targetPath)) {
    return Response.json({ error: 'Unsupported GeckoTerminal path' }, { status: 400 })
  }

  const targetUrl = `https://api.geckoterminal.com/api/v2${targetPath}${search}`

  const response = await fetch(targetUrl, {
    headers: {
      accept: 'application/json',
    },
  })

  const data = await response.text()

  return new Response(data, {
    status: response.status,
    headers: {
      'content-type': response.headers.get('content-type') || 'application/json',
    },
  })
}

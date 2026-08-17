export async function GET(request) {
  const { pathname, search } = new URL(request.url)
  const targetPath = pathname.replace('/api/geckoterminal', '')
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
      'access-control-allow-origin': '*',
    },
  })
}

export async function POST(request) {
  const { pathname, search } = new URL(request.url)
  const targetPath = pathname.replace('/api/geckoterminal', '')
  const targetUrl = `https://api.geckoterminal.com/api/v2${targetPath}${search}`

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: await request.text(),
  })

  const data = await response.text()

  return new Response(data, {
    status: response.status,
    headers: {
      'content-type': response.headers.get('content-type') || 'application/json',
      'access-control-allow-origin': '*',
    },
  })
}

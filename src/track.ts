import { MCEvent } from '@managed-components/types'
import crypto from 'crypto'

const getClickId = (event: MCEvent) => {
  const { client } = event
  let ttclid = client.get('tk-click') || ''

  if (client.url.searchParams?.has('ttclid')) {
    ttclid = client.url.searchParams.get('ttclid') || ''
    client.set('tk-click', ttclid)
  }
  return ttclid
}

const getTtp = (event: MCEvent): string => {
  const { client } = event
  const ttp = client.get('_ttp')
  if (!ttp) {
    const uid = crypto.randomUUID()
    client.set('_ttp', uid, { scope: 'infinite' })
    return uid
  }

  return ttp
}

const getRequestBody = (event: MCEvent) => {
  const { client } = event

  const body: { [k: string]: any } = {
    event: '',
    context: {
      ad: {
        callback: undefined,
      },
      ip: client.ip,
      user_agent: client.userAgent,
      page: {
        url: client.url.toString(),
        referrer: client.referer,
      },
      user: {
        external_id: client.get('external_id'),
        phone_number: client.get('phone_number'),
        email: client.get('email'),
        ttp: getTtp(event),
      },
    },
    properties: {
      contents: [],
    },
  }

  const ttkclid = getClickId(event)
  if (ttkclid) {
    body.context.ad.callback = ttkclid
  } else {
    body.context.ad = undefined
  }

  return body
}

export { getRequestBody }
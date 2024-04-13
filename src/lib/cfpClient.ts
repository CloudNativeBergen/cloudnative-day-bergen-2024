import { CFP, CfpResponse } from '@/types/cfp';

export async function getCfp(id?: string): Promise<CfpResponse> {
  let url = `${process.env.NEXT_PUBLIC_URL}/api/cfp`
  if (id) {
    url += `/${id}`
  }

  const res = await fetch(url)
  return await res.json() as CfpResponse
}

export async function postCfp(cfp: CFP, id?: string): Promise<CfpResponse> {
  let url = `${process.env.NEXT_PUBLIC_URL}/api/cfp`
  let method = 'POST'
  if (id) {
    url += `/${id}`
    method = 'PUT'
  }

  const res = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cfp),
  });

  return await res.json() as CfpResponse
}
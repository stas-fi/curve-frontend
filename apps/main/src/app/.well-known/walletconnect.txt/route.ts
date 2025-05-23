import { headers } from 'next/headers'

const WALLET_CONNECT_ACCOUNT = `c3fe8dd8-93df-44af-803f-83798aa1d440`

// for curve-dapp-git-feat-connect-modal-curvefi.vercel.app, other domains can be added the dashboard
const VERCEL_DOMAIN_VERIFICATION = '0c282d3503877d627a6a75095ebdb60530b900d3b194d046f6d8da3ae19fd48e'
// for curve.fi and staging.curve.fi
const CURVE_FI_DOMAIN_VERIFICATION = '3d76b3cd8cd754f34ac1c18ff25dc23ee9b80fc7f75800041335263b11f20b19'
// for curve.finance and staging.curve.finance
const CURVE_FINANCE_DOMAIN_VERIFICATION = '93dd06ccd309b9328401c5a32d519b120d1242189f20354da16a3188d6b4fe31'

/** Get the token used to verify the domain in the wallet connect dashboard */
const getDomainVerificationToken = (host: string) =>
  [
    WALLET_CONNECT_ACCOUNT,
    host.endsWith('vercel.app')
      ? VERCEL_DOMAIN_VERIFICATION
      : host.endsWith('curve.fi')
        ? CURVE_FI_DOMAIN_VERIFICATION
        : CURVE_FINANCE_DOMAIN_VERIFICATION,
  ].join('=')

export const GET = async () => {
  const head = await headers()
  const host = head.get('host')
  return new Response(getDomainVerificationToken(host ?? ''))
}

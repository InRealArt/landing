import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const runtime = 'nodejs'
export const alt = 'In Real Art'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const [fontRegularBuf, fontBoldBuf, logoBuf] = await Promise.all([
    readFile(join(process.cwd(), 'public/fonts/BricolageGrotesque-Regular.ttf')),
    readFile(join(process.cwd(), 'public/fonts/BricolageGrotesque-Bold.ttf')),
    readFile(join(process.cwd(), 'public/icons/inrealart_logo.png')),
  ])

  // Convert Node.js Buffers to plain ArrayBuffers (required by ImageResponse)
  const fontRegular: ArrayBuffer = new Uint8Array(fontRegularBuf).buffer
  const fontBold: ArrayBuffer = new Uint8Array(fontBoldBuf).buffer

  const logoSrc = `data:image/png;base64,${logoBuf.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gold top border */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, #b89c72 40%, #b89c72 60%, transparent)',
        }} />
        {/* Gold bottom border */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, #b89c72 40%, #b89c72 60%, transparent)',
        }} />

        {/* Center content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={120} height={120} style={{ borderRadius: '4px' }} alt="" />

          <div style={{ width: '40px', height: '1px', background: '#b89c72' }} />

          <div style={{
            fontFamily: 'Bricolage',
            fontSize: '13px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: 400,
          }}>
            inrealart.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Bricolage', data: fontRegular, weight: 400 },
        { name: 'Bricolage', data: fontBold, weight: 700 },
      ],
    }
  )
}

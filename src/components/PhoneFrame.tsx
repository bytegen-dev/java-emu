import type { ReactNode } from 'react'

type Props = {
  title?: string
  children: ReactNode
}

export function PhoneFrame({ title = 'J2ME-style shell', children }: Props) {
  return (
    <div className="phone-frame">
      <div className="phone-bezel">
        <div className="phone-earpiece" />
        <div className="phone-screen">
          <header className="phone-status">{title}</header>
          <div className="phone-content">{children}</div>
        </div>
        <div className="phone-keys">
          <span className="key soft">◀</span>
          <span className="key nav">▲</span>
          <span className="key soft">▶</span>
        </div>
      </div>
    </div>
  )
}

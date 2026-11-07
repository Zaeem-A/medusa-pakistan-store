import { getBaseURL } from "@lib/util/env"
import { STORE_NAME } from "@lib/util/store-name"
import { Metadata } from "next"
import "styles/globals.css"

// Pages set only their own title. The template adds the store name once.
export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: STORE_NAME,
    template: `%s | ${STORE_NAME}`,
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <head>
        <link rel="ucp" href="/.well-known/ucp" />
      </head>
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}

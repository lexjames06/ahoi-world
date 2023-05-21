import Ahoi from "./ahoi"
import Navbar from "./components/Navbar"
import './globals.css'

export const metadata = {
  title: 'Ahoi World',
  description: 'Personal website for Software Engineer AJ Stewart',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta property="og:image" content="<generated>" />
        <meta property="og:image:type" content="<generated>" />
        <meta property="og:image:width" content="<generated>" />
        <meta property="og:image:height" content="<generated>" />

        <meta name="twitter:image" content="<generated>" />
        <meta name="twitter:image:type" content="<generated>" />
        <meta name="twitter:image:width" content="<generated>" />
        <meta name="twitter:image:height" content="<generated>" />
      </head>
      <body>
        <Ahoi>
          <Navbar />
          {children}
        </Ahoi>
      </body>
    </html>
  )
}

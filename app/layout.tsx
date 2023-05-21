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
      <body>
        <Ahoi>
          <Navbar />
          {children}
        </Ahoi>
      </body>
    </html>
  )
}

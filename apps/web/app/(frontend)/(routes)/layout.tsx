import { Navbar } from "@/components/ui/navigation/navbar"

const Layout = ({ children }: Readonly<{ children: React.ReactNode}>) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default Layout
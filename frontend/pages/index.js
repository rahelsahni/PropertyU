import { useEffect } from "react"
import Router from 'next/router'

/**
 * @desc Re-direct off the default nextjs URL
 */
export default function Home() {
  useEffect(() => {
    Router.push('/login');
  })
  return (
    <div>  
    </div>
  )
}

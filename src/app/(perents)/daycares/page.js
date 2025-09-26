import DaycareListingsPage from '@/components/DaycaresList'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback="Loading...">
      <DaycareListingsPage/>
    </Suspense>
  )
}

export default page

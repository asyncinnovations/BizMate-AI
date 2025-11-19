import CreateInvoicePage from '@/components/create-invoice/CreateInvoice';
import LoadingSpinner from '@/components/loading-spinner/LoadingSpinner';
import React, { Suspense } from 'react'

const Page = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen={true} />}>
      <CreateInvoicePage />
    </Suspense>
  )
}

export default Page;
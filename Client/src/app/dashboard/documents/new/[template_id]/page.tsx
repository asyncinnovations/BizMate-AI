import DocumentForm from '@/components/document-form/DocumentForm';
import LoadingSpinner from '@/components/loading-spinner/LoadingSpinner';
import React, { Suspense } from 'react'

const Page = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen={true} />}>
      <DocumentForm />
    </Suspense>
  )
}

export default Page;
import DocumentForm from "@/app/components/document-form/DocumentForm";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <DocumentForm />
    </Suspense>
  );
};

export default Page;

import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen.ts'
import { StrictMode } from 'react'
import { FormProvider } from './utils/hooks/FormContext.tsx'
import { ErrorProvider } from './utils/hooks/ErrorContext.tsx'

const queryClient = new QueryClient()
const router = createRouter({ routeTree })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
   <ErrorProvider>
      <FormProvider>
      <RouterProvider router={router} />
    </FormProvider>
   </ErrorProvider>
  </QueryClientProvider>
  </StrictMode>,
)

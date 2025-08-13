import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen.ts'
import { StrictMode } from 'react'
import { FormProvider } from './utils/hooks/FormContext.tsx'

const queryClient = new QueryClient()
const router = createRouter({ routeTree })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <FormProvider>
      <RouterProvider router={router} />
    </FormProvider>
  </QueryClientProvider>
  </StrictMode>,
)

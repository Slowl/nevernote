import './styles/globals'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes/index'
import { ReactQueryClientProvider } from '@/utils/providers'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ReactQueryClientProvider>
			<RouterProvider router={router} />
		</ReactQueryClientProvider>
  </React.StrictMode>,
)

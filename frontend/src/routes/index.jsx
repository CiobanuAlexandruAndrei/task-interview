import HomePage from '../pages/HomePage'
import DetailPage from '../pages/DetailPage'

export const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/details/:id',
    element: <DetailPage />,
  }
]
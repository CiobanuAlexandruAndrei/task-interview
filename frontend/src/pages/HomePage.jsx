import { DocumentList } from '../components/HomePage/DocumentList'

export default function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Documents</h1>
      <DocumentList />
    </div>
  )
} 
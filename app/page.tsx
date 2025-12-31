
'use client'
import { useRouter } from "next/navigation";

export default function App() {

  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Admin Dashboard</h1>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => router.push('/login')}
      >
        Go to Login
      </button>
    </div>
  )

}
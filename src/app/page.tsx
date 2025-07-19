// src/app/page.tsx
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl mb-6 text-glow">Welcome to Nexus Club</h1>
      <p>For admins, please go to the <a href="/nx-admin" className="text-blue-500">Login Page</a></p>
    </div>
  )
}

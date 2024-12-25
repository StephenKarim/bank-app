export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Bank App</h1>
      <p className="text-lg mb-6 text-center">
        Manage customer data and streamline internal processes.
      </p>
      <a
        href="/dashboard"
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go to Dashboard
      </a>
    </div>
  );
}

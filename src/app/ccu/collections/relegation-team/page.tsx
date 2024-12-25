export default function RelegationTeamPage() {
  const subcategories = [
    {
      name: "Create A19 Form",
      link: "/ccu/collections/relegation-team/create-a19-form",
    },
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Relegation Team</h1>

      {/* Subcategory Navigation */}
      <div className="grid gap-4">
        {subcategories.map((sub) => (
          <a
            key={sub.name}
            href={sub.link}
            className="block px-6 py-3 rounded bg-yellow-600 text-white text-lg hover:bg-yellow-700 transition"
          >
            {sub.name}
          </a>
        ))}
      </div>
    </div>
  );
}

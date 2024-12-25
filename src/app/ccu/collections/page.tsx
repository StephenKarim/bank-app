export default function CollectionsPage() {
  const subcategories = [
    { name: "Relegation Team", link: "/ccu/collections/relegation-team" },
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Collections</h1>

      {/* Subcategory Navigation */}
      <div className="grid gap-4">
        {subcategories.map((sub) => (
          <a
            key={sub.name}
            href={sub.link}
            className="block px-6 py-3 rounded bg-green-600 text-white text-lg hover:bg-green-700 transition"
          >
            {sub.name}
          </a>
        ))}
      </div>
    </div>
  );
}

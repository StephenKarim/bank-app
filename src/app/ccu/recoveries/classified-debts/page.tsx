export default function ClassifiedDebtsPage() {
  const subcategories = [
    { name: "Portfolios", link: "/ccu/recoveries/classified-debts/portfolios" },
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Classified Debts</h1>

      {/* Subcategory Navigation */}
      <div className="grid gap-4">
        {subcategories.map((sub) => (
          <a
            key={sub.name}
            href={sub.link}
            className="block px-6 py-3 rounded bg-purple-600 text-white text-lg hover:bg-purple-700 transition"
          >
            {sub.name}
          </a>
        ))}
      </div>
    </div>
  );
}

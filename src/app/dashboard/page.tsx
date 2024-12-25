export default function Dashboard() {
  const units = [
    { name: "Business Support Services (BSS)", link: "/bss" },
    { name: "Account and Trade Services (ATS)", link: "/ats" },
    { name: "Centralised Securities Unit (CSU)", link: "/csu" },
    { name: "Customer Care and Support Centre (CC&SC)", link: "/ccsc" },
    { name: "Data Processing Services (DPS)", link: "/dps" },
    { name: "Electronic Channels Support Services (ECSS)", link: "/ecss" },
    { name: "Centralized Credit Unit (CCU)", link: "/ccu" },
    { name: "Loan Delivery Centre (LDC)", link: "/ldc" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Shared Services Division</h1>
      <ul className="grid gap-4">
        {units.map((unit) => (
          <li key={unit.name}>
            <a
              href={unit.link}
              className="block px-6 py-3 rounded bg-blue-600 text-white text-lg hover:bg-blue-700 transition"
            >
              {unit.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

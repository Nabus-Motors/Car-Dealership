export function PremiumSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Premium Financing Options</h2>
            <p className="text-lg text-gray-200 mb-4">
              Flexible payment plans designed to fit your budget and lifestyle.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-amber-500 text-2xl">✓</span>
                <span>Competitive interest rates</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-500 text-2xl">✓</span>
                <span>Quick approval process</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-500 text-2xl">✓</span>
                <span>Flexible loan terms</span>
              </li>
            </ul>
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded font-semibold transition-colors">
              Get Pre-Approved
            </button>
          </div>
          <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1552820728-8ac41f1ce891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpbmd8ZW58MXx8fHwxNzYzNTYwNzA5fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Financing"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

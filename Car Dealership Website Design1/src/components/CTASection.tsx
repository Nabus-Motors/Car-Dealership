export function CTASection() {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-white mb-6">Ready to find your perfect car?</h2>
        <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
          Visit our showroom or schedule a test drive today
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded transition-colors">
            Schedule Test Drive
          </button>
          <button className="bg-black text-white hover:bg-gray-900 px-8 py-3 rounded transition-colors">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}

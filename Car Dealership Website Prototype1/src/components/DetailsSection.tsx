import React, { useState } from 'react';

export function DetailsSection() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'technical', label: 'Technical' },
    { id: 'location', label: 'Location' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 transition-all duration-200 border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#2563eb] text-[#2563eb]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="prose max-w-none">
        {activeTab === 'overview' && (
          <div>
            <h2>Vehicle Overview</h2>
            <p>
              The Ferrari GTC4Lusso is a masterpiece of Italian engineering, combining breathtaking
              performance with unparalleled luxury. This stunning 3-door coupe represents the pinnacle
              of Ferrari's commitment to excellence, featuring a naturally aspirated V12 engine that
              delivers an exhilarating driving experience.
            </p>
            <p>
              With its distinctive shooting brake design, the GTC4Lusso offers exceptional versatility
              without compromising on style. The vehicle's advanced all-wheel-drive system ensures
              optimal traction in all conditions, while the sophisticated suspension provides both
              comfort and precision handling.
            </p>
            <p>
              The interior is a showcase of craftsmanship, featuring premium leather upholstery,
              carbon fiber accents, and cutting-edge technology. Every detail has been meticulously
              designed to create an environment that is both luxurious and driver-focused.
            </p>
            <h3>Key Features</h3>
            <ul>
              <li>6.3L V12 engine producing 680 horsepower</li>
              <li>0-60 mph in just 3.4 seconds</li>
              <li>Top speed of 208 mph</li>
              <li>Advanced magnetic ride control suspension</li>
              <li>Premium Frau leather interior</li>
              <li>Carbon ceramic brakes</li>
              <li>Dual-zone automatic climate control</li>
              <li>Premium audio system</li>
            </ul>
          </div>
        )}

        {activeTab === 'technical' && (
          <div>
            <h2>Technical Specifications</h2>
            
            <h3>Engine & Performance</h3>
            <ul>
              <li><strong>Engine Type:</strong> 3.9L V8 Twin-Turbocharged</li>
              <li><strong>Horsepower:</strong> 680 hp @ 8,000 rpm</li>
              <li><strong>Torque:</strong> 514 lb-ft @ 3,000 rpm</li>
              <li><strong>Transmission:</strong> 7-Speed Dual-Clutch Automatic</li>
              <li><strong>Drive Type:</strong> Rear-Wheel Drive (RWD)</li>
              <li><strong>0-60 mph:</strong> 3.4 seconds</li>
              <li><strong>Top Speed:</strong> 208 mph</li>
              <li><strong>Fuel Economy:</strong> 12 city / 17 highway mpg</li>
            </ul>

            <h3>Dimensions & Weight</h3>
            <ul>
              <li><strong>Length:</strong> 185.0 inches</li>
              <li><strong>Width:</strong> 77.5 inches</li>
              <li><strong>Height:</strong> 52.3 inches</li>
              <li><strong>Wheelbase:</strong> 107.1 inches</li>
              <li><strong>Curb Weight:</strong> 4,145 lbs</li>
            </ul>

            <h3>Safety Features</h3>
            <ul>
              <li>Advanced airbag system</li>
              <li>Anti-lock braking system (ABS)</li>
              <li>Electronic stability control</li>
              <li>Traction control system</li>
              <li>Parking sensors front and rear</li>
              <li>Rearview camera</li>
            </ul>
          </div>
        )}

        {activeTab === 'location' && (
          <div>
            <h2>Vehicle Location</h2>
            <p>
              This exceptional Ferrari GTC4 is currently located at our premium dealership showroom.
              We invite you to schedule a private viewing to experience this magnificent vehicle
              firsthand.
            </p>
            
            <h3>Dealership Information</h3>
            <div className="bg-gray-50 p-6 rounded-lg not-prose">
              <div className="space-y-3">
                <div>
                  <div className="text-gray-600">Address</div>
                  <div>123 Luxury Auto Boulevard</div>
                  <div>Beverly Hills, CA 90210</div>
                </div>
                <div>
                  <div className="text-gray-600">Hours of Operation</div>
                  <div>Monday - Friday: 9:00 AM - 7:00 PM</div>
                  <div>Saturday: 10:00 AM - 6:00 PM</div>
                  <div>Sunday: Closed</div>
                </div>
                <div>
                  <div className="text-gray-600">Contact</div>
                  <div>Phone: (310) 555-0123</div>
                  <div>Email: sales@yourdealership.com</div>
                </div>
              </div>
            </div>

            <h3>Schedule a Viewing</h3>
            <p>
              Contact us today to arrange a personalized viewing of this extraordinary vehicle.
              Our knowledgeable sales team is ready to answer any questions and facilitate a
              test drive at your convenience.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

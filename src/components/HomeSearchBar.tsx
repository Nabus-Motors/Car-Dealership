import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function HomeSearchBar() {
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState(500000);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [bodyStyle, setBodyStyle] = useState('');
  const [condition, setCondition] = useState('');
  const [transmission, setTransmission] = useState('');

  const makes = [
    'Toyota', 'BMW', 'Mercedes', 'Audi', 'Honda', 'Nissan',
    'Kia', 'Hyundai', 'Tesla', 'Ford', 'Chevrolet', 'Volkswagen',
    'Lamborghini', 'Ferrari', 'Porsche', 'Range Rover',
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (make) params.set('make', make);
    if (model) params.set('model', model);
    if (bodyStyle) params.set('body_style', bodyStyle);
    if (condition) params.set('condition', condition);
    if (transmission) params.set('transmission', transmission);
    if (priceRange) params.set('max_price', priceRange.toString());

    navigate(`/explore?${params.toString()}`);
  };

  const priceDisplay = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: 0,
  }).format(priceRange);

  return (
    <div className="home-search-bar">
      <div className="search-bar-inner">
        {/* Make */}
        <div className="search-field">
          <label>Select Make</label>
          <select 
            value={make} 
            onChange={(e) => setMake(e.target.value)}
            className="search-select"
          >
            <option value="">--Any Make--</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div className="search-field">
          <label>Select Model</label>
          <select 
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="search-select"
          >
            <option value="">--Any Model--</option>
            <option value="Aventador">Aventador</option>
            <option value="S-Class">S-Class</option>
            <option value="GT">GT</option>
            <option value="Civic">Civic</option>
            <option value="Accord">Accord</option>
          </select>
        </div>

        {/* Body Style */}
        <div className="search-field">
          <label>Select Body Style</label>
          <select 
            value={bodyStyle}
            onChange={(e) => setBodyStyle(e.target.value)}
            className="search-select"
          >
            <option value="">--Any Body Style--</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="coupe">Coupe</option>
            <option value="pickup">Pickup</option>
            <option value="convertible">Convertible</option>
            <option value="hatchback">Hatchback</option>
          </select>
        </div>

        {/* Condition */}
        <div className="search-field">
          <label>Select Condition</label>
          <select 
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="search-select"
          >
            <option value="">--Any Condition--</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
        </div>

        {/* Transmission */}
        <div className="search-field">
          <label>Select Transmission</label>
          <select 
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
            className="search-select"
          >
            <option value="">--Any Transmission--</option>
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="search-field price-range-field">
          <label>Price Range: <span id="price-display">{priceDisplay}</span></label>
          <input 
            type="range" 
            min="0" 
            max="1000000" 
            step="5000" 
            value={priceRange}
            onChange={(e) => setPriceRange(parseInt(e.target.value))}
            className="search-range"
          />
        </div>

        {/* Search Button */}
        <button 
          className="search-submit-btn"
          onClick={handleSearch}
        >
          Search Inventory
        </button>
      </div>
    </div>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatPrice, formatMileage } from "@/utils/format";
import { db, COLLECTIONS } from "@/firebase/firebase";
import { doc, getDoc, collection, query, where, limit, getDocs } from "firebase/firestore";
import { CarCard } from "@/components/CarCard";
import OptimizedImage from "@/components/OptimizedImage";
import { ContactFormDialog } from "@/components/ContactFormDialog";
import { TestDriveDialog } from "@/components/TestDriveDialog";
import type { Car } from "@/types/car";

export default function CarDetailsPage() {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [similarCars, setSimilarCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "technical" | "location">("overview");
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [testDriveOpen, setTestDriveOpen] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        if (!carId) {
          setLoading(false);
          return;
        }

        const carRef = doc(db, COLLECTIONS.CARS, carId);
        const carSnap = await getDoc(carRef);

        if (carSnap.exists()) {
          const carData = { id: carSnap.id, ...carSnap.data() } as Car;
          setCar(carData);

          // Fetch similar cars by brand
          try {
            const similarSnap = await getDocs(
              query(
                collection(db, COLLECTIONS.CARS),
                where("brand", "==", carData.brand),
                limit(6)
              )
            );
            const similar = similarSnap.docs
              .filter((d) => d.id !== carId)
              .slice(0, 3)
              .map((d) => ({ id: d.id, ...d.data() } as Car));
            setSimilarCars(similar);
          } catch (err) {
            console.warn("Failed to fetch similar cars:", err);
          }
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0A0A0A] border-t-transparent animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4 font-bold">Loading car details...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="pt-20 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-bold mb-4">Car not found</p>
          <button
            onClick={() => navigate("/explore")}
            className="bg-[#0A0A0A] text-white px-6 py-2 rounded font-semibold hover:bg-gray-800"
          >
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }

  const images = car.imageUrls ?? [];

  return (
    <div className="min-h-screen bg-white">
      {/* Page Hero */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-[#F9F9F7] to-white border-b border-[#E8E8E8]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm font-bold text-[#888] uppercase tracking-[2px] mb-2">
              Vehicle Details
            </p>
            <h1 className="text-4xl md:text-5xl font-900 text-[#1C1C1E] mb-3">
              {car.year} {car.brand} {car.model}
            </h1>
            <p className="text-sm text-[#888]">
              Stock: {car.id?.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="car-detail-grid">
          {/* LEFT: Images + Specs + Info */}
          <div className="detail-left">
            {/* Main Gallery */}
            <div className="gallery-main">
              <div className="gallery-ribbon">
                {car.condition === "New" ? "NEW" : "USED"}
              </div>
              <OptimizedImage
                src={images[imageIndex]}
                alt={`${car.year} ${car.brand} ${car.model}`}
                priority={true}
                aspectRatio="16/9"
                className="w-full h-full"
              />
              <button className="gallery-video-btn">? Watch Video</button>
              <button className="gallery-save-btn" aria-label="Save to wishlist">
                ?
              </button>
            </div>

            {/* Thumbnail Gallery */}
            <div className="gallery-thumbs">
              {images.length > 0 ? (
                images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`thumb-img-container ${idx === imageIndex ? "active" : ""}`}
                  >
                    <OptimizedImage
                      src={img}
                      alt={`Thumbnail ${idx}`}
                      priority={false}
                      aspectRatio="1/1"
                      className="w-full h-full"
                    />
                  </button>
                ))
              ) : (
                <div className="col-span-4 h-20 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                  No images
                </div>
              )}
            </div>

            {/* Specs Strip */}
            <div className="detail-specs-strip">
              <div className="dspec">
                <span className="dspec-icon">?</span>
                <span className="dspec-label">FUEL TYPE</span>
                <span className="dspec-val">{car.fuelType ?? "Petrol"}</span>
              </div>
              <div className="dspec">
                <span className="dspec-icon">??</span>
                <span className="dspec-label">MILEAGE</span>
                <span className="dspec-val">{formatMileage(car.mileage)}</span>
              </div>
              <div className="dspec">
                <span className="dspec-icon">??</span>
                <span className="dspec-label">ENGINE</span>
                <span className="dspec-val">{car.transmission ?? "Auto"}</span>
              </div>
              <div className="dspec">
                <span className="dspec-icon">??</span>
                <span className="dspec-label">CAR TYPE</span>
                <span className="dspec-val">{car.condition}</span>
              </div>
              <div className="dspec">
                <span className="dspec-icon">??</span>
                <span className="dspec-label">TRANSMISSION</span>
                <span className="dspec-val">{car.transmission ?? "Auto"}</span>
              </div>
              <div className="dspec">
                <span className="dspec-icon">???</span>
                <span className="dspec-label">YEAR</span>
                <span className="dspec-val">{car.year}</span>
              </div>
            </div>

            {/* Dealer Note */}
            <div className="dealer-note">
              <strong>Dealer Note:</strong> {car.description ?? "Premium vehicle in excellent condition. Well-maintained with full service history."}
            </div>

            {/* Tabs */}
            <div className="detail-tabs">
              <button
                className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`tab-btn ${activeTab === "technical" ? "active" : ""}`}
                onClick={() => setActiveTab("technical")}
              >
                Technical
              </button>
              <button
                className={`tab-btn ${activeTab === "location" ? "active" : ""}`}
                onClick={() => setActiveTab("location")}
              >
                Location
              </button>
            </div>

            <div className="tab-content" style={{ display: activeTab === "overview" ? "block" : "none" }}>
              <p>{car.description || "This is a premium vehicle in excellent condition."}</p>
            </div>
            <div className="tab-content" style={{ display: activeTab === "technical" ? "block" : "none" }}>
              <div className="space-y-2">
                <p><strong>Fuel Type:</strong> {car.fuelType}</p>
                <p><strong>Transmission:</strong> {car.transmission}</p>
                <p><strong>Condition:</strong> {car.condition}</p>
                <p><strong>Mileage:</strong> {formatMileage(car.mileage)}</p>
              </div>
            </div>
            <div className="tab-content" style={{ display: activeTab === "location" ? "block" : "none" }}>
              <p>
                Located in{" "}
                {typeof car.location === "string"
                  ? car.location
                  : car.location?.name ?? "Accra, Ghana"}
              </p>
            </div>
          </div>

          {/* RIGHT: Sticky Sidebar */}
          <div className="detail-sidebar">
            {/* Price Card */}
            <div className="sidebar-price-card">
              <div className="sidebar-msrp">ASKING PRICE</div>
              <div className="sidebar-price">{formatPrice(car.price ?? 0)}</div>
              <div className="sidebar-price-note">Included Taxes & Fees</div>
            </div>

            {/* Action Buttons */}
            <div className="sidebar-actions">
              <button
                className="sidebar-btn primary"
                onClick={() => setContactFormOpen(true)}
              >
                Get a Quote
              </button>
              <button
                className="sidebar-btn secondary"
                onClick={() => setTestDriveOpen(true)}
              >
                Book Test Drive
              </button>
              <button
                className="sidebar-btn secondary"
                onClick={() => setContactFormOpen(true)}
              >
                Make an Offer
              </button>
              <button
                className="sidebar-btn secondary"
                onClick={() => setContactFormOpen(true)}
              >
                Confirm Availability
              </button>
            </div>

            {/* Utility Buttons */}
            <div className="sidebar-utility">
              <button className="utility-btn">
                <span>?</span> Share
              </button>
              <button className="utility-btn">
                <span>??</span> Print
              </button>
              <button className="utility-btn">
                <span>??</span> Sticker
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Vehicles */}
      {similarCars.length > 0 && (
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-20">
          <div className="similar-section">
            <div className="section-label">
              <span className="section-label-text">Related Listings</span>
              <div className="section-label-line"></div>
            </div>
            <h2 className="section-title">
              You May Also Like <span className="gold">Vehicles</span>
            </h2>
            <div className="cars-grid">
              {similarCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <ContactFormDialog
        open={contactFormOpen}
        onOpenChange={setContactFormOpen}
        carTitle={`${car.year} ${car.brand} ${car.model}`}
      />
      <TestDriveDialog
        open={testDriveOpen}
        onOpenChange={setTestDriveOpen}
        carTitle={`${car.year} ${car.brand} ${car.model}`}
      />
    </div>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Fuel, Gauge, Cog, BadgeCheck, Calendar, Wrench, MapPin } from "lucide-react";
import { formatPrice, formatMileage } from "@/utils/format";
import { db, COLLECTIONS } from "@/firebase/firebase";
import { doc, getDoc, collection, query, where, limit, getDocs } from "firebase/firestore";
import { VehicleCard } from "@/components/VehicleCard";
import OptimizedImage from "@/components/OptimizedImage";
import { ContactFormDialog } from "@/components/ContactFormDialog";
import { TestDriveDialog } from "@/components/TestDriveDialog";
import type { Car } from "@/types/car";

const PRIMARY_BTN =
  "flex w-full items-center justify-center bg-[var(--accent-solid)] px-6 py-3 text-[13px] font-bold uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:bg-[var(--accent-light)]";
const SECONDARY_BTN =
  "flex w-full items-center justify-center border border-ink px-6 py-3 text-[13px] font-bold uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:bg-ink hover:text-white";

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
        <div className="flex min-h-screen min-w-screen items-center justify-center bg-white pt-20">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin border-4 border-ink border-t-transparent"></div>
            <p className="mt-4 font-bold text-ink/60">Loading car details...</p>
          </div>
        </div>
    );
  }

  if (!car) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white pt-20">
          <div className="text-center">
            <p className="mb-4 font-bold text-ink/60">Car not found</p>
            <button
                onClick={() => navigate("/explore")}
                className="bg-ink px-6 py-2.5 text-[13px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-charcoal"
            >
              Back to Inventory
            </button>
          </div>
        </div>
    );
  }

  const images = car.imageUrls ?? [];

  const specs = [
    { Icon: Calendar, label: "Year", value: String(car.year) },
    { Icon: Gauge, label: "Mileage", value: `${formatMileage(car.mileage)} km` },
    { Icon: Fuel, label: "Fuel Type", value: car.fuelType ?? "Petrol" },
    { Icon: Wrench, label: "Engine", value: car.transmission ?? "Auto" },
    { Icon: BadgeCheck, label: "Car Type", value: car.condition },
    { Icon: Cog, label: "Transmission", value: car.transmission ?? "Auto" },
  ];

  const locationLabel =
      typeof car.location === "string"
          ? car.location
          : car.location?.name ?? "Accra, Ghana";

  return (
      <div className="min-h-screen bg-white">
        {/* Page Header */}
        <section className="border-b border-[var(--hairline)] bg-white py-8">
          <div className="shell">
            <p className="eyebrow text-[var(--accent-deep)]">Vehicle Details</p>
            <h1 className="mt-3 font-display display-lead uppercase text-ink">
              {car.year} {car.brand} {car.model}
            </h1>
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-ink/45">
              Stock: {car.id?.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="shell py-12">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_360px]">
            {/* LEFT: Images */}
            <div>
              {/* Main Image */}
              <div className="relative border border-[var(--hairline)] bg-[#F0EFE9]">
                <span className="absolute left-0 top-4 z-10 bg-ink px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                  {car.condition === "New" ? "New" : "Used"}
                </span>
                {images.length > 1 && (
                    <span className="absolute right-3 top-3 z-10 bg-ink/75 px-2.5 py-1 text-[11px] font-semibold text-white">
                      {imageIndex + 1} / {images.length}
                    </span>
                )}
                <OptimizedImage
                    src={images[imageIndex]}
                    alt={`${car.year} ${car.brand} ${car.model}`}
                    priority={true}
                    aspectRatio="16/9"
                    className="w-full h-full"
                />
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 0 ? (
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setImageIndex(idx)}
                            className={`relative aspect-square overflow-hidden border transition-colors ${
                                idx === imageIndex
                                    ? "border-[var(--accent-solid)]"
                                    : "border-[var(--hairline)] hover:border-ink/30"
                            }`}
                        >
                          <OptimizedImage
                              src={img}
                              alt={`Thumbnail ${idx}`}
                              priority={false}
                              aspectRatio="1/1"
                              className="w-full h-full"
                          />
                        </button>
                    ))}
                  </div>
              ) : (
                  <div className="mt-4 flex h-20 items-center justify-center border border-[var(--hairline)] text-sm text-ink/45">
                    No images
                  </div>
              )}
            </div>

            {/* RIGHT: Sidebar */}
            <div className="lg:sticky lg:top-24">
              {/* Price Card */}
              <div className="border border-[var(--hairline)] p-6">
                <p className="eyebrow text-ink/40">Asking Price</p>
                <div className="mt-2 bg-ink px-4 py-3 font-display text-2xl font-medium text-white">
                  {formatPrice(car.price ?? 0)}
                </div>
                <p className="mt-2 text-xs text-ink/45">Included Taxes &amp; Fees</p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-col gap-3">
                <button className={PRIMARY_BTN} onClick={() => setContactFormOpen(true)}>
                  Get a Quote
                </button>
                <button className={SECONDARY_BTN} onClick={() => setTestDriveOpen(true)}>
                  Book Test Drive
                </button>
                <button className={SECONDARY_BTN} onClick={() => setContactFormOpen(true)}>
                  Make an Offer
                </button>
                <button className={SECONDARY_BTN} onClick={() => setContactFormOpen(true)}>
                  Confirm Availability
                </button>
              </div>
            </div>
          </div>

          {/* Specs, Dealer Note & Tabs */}
          <div className="mx-auto mt-14 max-w-3xl">
            {/* Specs Strip */}
            <div className="grid grid-cols-2 gap-px border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-3">
              {specs.map(({ Icon, label, value }) => (
                  <div key={label} className="flex flex-col items-center gap-2 bg-white px-3 py-6 text-center">
                    <Icon className="h-5 w-5 text-[var(--accent-deep)]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/40">
                      {label}
                    </span>
                    <span className="text-sm font-semibold text-ink">{value}</span>
                  </div>
              ))}
            </div>

            {/* Dealer Note */}
            <div className="mt-8 border-l-2 border-[var(--accent-solid)] bg-[#F9F9F7] px-5 py-4 text-sm leading-7 text-ink/70">
              <strong className="text-ink">Dealer Note:</strong>{" "}
              {car.description ?? "Premium vehicle in excellent condition. Well-maintained with full service history."}
            </div>

            {/* Tabs */}
            <div className="mt-10 flex gap-8 border-b border-[var(--hairline)]">
              {(["overview", "technical", "location"] as const).map((tab) => (
                  <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`-mb-px border-b-2 pb-3 text-[13px] font-bold uppercase tracking-[0.14em] transition-colors ${
                          activeTab === tab
                              ? "border-[var(--accent-solid)] text-ink"
                              : "border-transparent text-ink/40 hover:text-ink/70"
                      }`}
                  >
                    {tab}
                  </button>
              ))}
            </div>

            <div className="mt-6 text-sm leading-7 text-ink/70">
              {activeTab === "overview" && (
                  <p>{car.description || "This is a premium vehicle in excellent condition."}</p>
              )}
              {activeTab === "technical" && (
                  <div className="space-y-2">
                    <p><strong className="text-ink">Fuel Type:</strong> {car.fuelType}</p>
                    <p><strong className="text-ink">Transmission:</strong> {car.transmission}</p>
                    <p><strong className="text-ink">Condition:</strong> {car.condition}</p>
                    <p><strong className="text-ink">Mileage:</strong> {formatMileage(car.mileage)} km</p>
                  </div>
              )}
              {activeTab === "location" && (
                  <p className="flex items-center justify-center gap-1.5">
                    <MapPin className="h-4 w-4 text-ink/45" />
                    Located in {locationLabel}
                  </p>
              )}
            </div>
          </div>
        </div>

        {/* Similar Vehicles */}
        {similarCars.length > 0 && (
            <section className="border-t border-[var(--hairline)] bg-white py-16 md:py-24">
              <div className="shell">
                <p className="eyebrow text-[var(--accent-deep)]">Related Listings</p>
                <h2 className="mt-4 font-display display-lead uppercase text-ink">
                  You May Also Like These Vehicles
                </h2>
                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {similarCars.map((similar) => (
                      <VehicleCard key={similar.id} car={similar} />
                  ))}
                </div>
              </div>
            </section>
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

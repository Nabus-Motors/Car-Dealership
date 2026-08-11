import { useEffect, useMemo, useState } from 'react';
import { collection, query, orderBy, limit, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase/firebase';
import type { Car } from '@/types/car';
import { normalizeImageUrls } from '@utils/images';
import { deriveFacets } from '@utils/inventory';

import HeroShowcase from '../components/home/HeroShowcase';
import SearchPanel from '../components/home/SearchPanel';
import QuickActions from '../components/home/QuickActions';
import FeaturedVehicles from '../components/home/FeaturedVehicles';
import BrowseBy from '../components/home/BrowseBy';
import OurServices from '../components/home/OurServices';
import StatsBand from '../components/home/StatsBand';
import ExploreBand from '../components/home/ExploreBand';


const FETCH_LIMIT = 12;

export function HomePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [facetCars, setFacetCars] = useState<Car[]>([]);
  const [facetsLoading, setFacetsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, COLLECTIONS.CARS)));
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Car[];
        setFacetCars(
          all.filter((c) => ['published', 'new', 'sold'].includes((c.status || 'draft') as string))
        );
      } catch (e) {
        console.warn('HomePage: facet load failed', e);
      } finally {
        setFacetsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const hydrate = (docs: any[]) =>
        docs.map((d) => {
          const car = { id: d.id, ...d.data() } as Car;
          car.imageUrls = normalizeImageUrls(car);
          return car;
        });

      try {
        const featSnap = await getDocs(query(collection(db, COLLECTIONS.FEATURED), limit(FETCH_LIMIT)));
        if (!featSnap.empty) {
          const resolved = await Promise.all(featSnap.docs.map(async (d) => {
            const data = d.data() as any;
            try {
              const carId: string | undefined = data?.carId || d.id;
              if (data && data.brand && data.model && data.price) {
                const inlineCar = { id: d.id, ...data } as Car;
                inlineCar.imageUrls = normalizeImageUrls(inlineCar);
                return inlineCar;
              }
              if (carId) {
                const ref = doc(db as any, COLLECTIONS.CARS, carId);
                const carDoc = await getDoc(ref);
                if (carDoc.exists()) {
                  const car = { id: carDoc.id, ...carDoc.data() } as Car;
                  car.imageUrls = normalizeImageUrls(car);
                  return car;
                }
              }
            } catch (e) {
              console.warn('HomePage: Error resolving featured car reference:', e);
            }
            return null;
          }));
          const featured = resolved.filter(Boolean) as Car[];
          if (featured.length > 0) {
            setCars(featured);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn('HomePage: FEATURED collection unavailable or error:', e);
      }

      const baseCol = collection(db, COLLECTIONS.CARS);

      try {
        const publishedOrdered = await getDocs(
          query(baseCol, where('status', '==', 'published'), orderBy('createdAt', 'desc'), limit(FETCH_LIMIT))
        );
        if (!publishedOrdered.empty) {
          setCars(hydrate(publishedOrdered.docs));
          setLoading(false);
          return;
        }
      } catch (err: any) {
        console.warn('HomePage: Published+ordered query failed (likely missing index). Retrying without orderBy...', err?.message || err);
      }

      try {
        const publishedOnly = await getDocs(
          query(baseCol, where('status', '==', 'published'), limit(FETCH_LIMIT))
        );
        if (!publishedOnly.empty) {
          setCars(hydrate(publishedOnly.docs));
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('HomePage: Published-only query failed, proceeding to general fallbacks...', err);
      }

      try {
        const recent = await getDocs(query(baseCol, orderBy('createdAt', 'desc'), limit(FETCH_LIMIT)));
        if (!recent.empty) {
          setCars(hydrate(recent.docs));
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('HomePage: Recent cars ordered query failed, trying simple limit...', err);
      }

      try {
        const anyDocs = await getDocs(query(baseCol, limit(FETCH_LIMIT)));
        const visible = hydrate(anyDocs.docs).filter((c) =>
          ['published', 'new', 'sold'].includes((c.status || 'draft') as string)
        );
        setCars(visible);
        setLoading(false);
      } catch (err) {
        console.error('HomePage: Final fallback failed:', err);
        setLoading(false);
      }
    })();
  }, []);

  const facets = useMemo(
    () => deriveFacets(facetCars.length ? facetCars : cars),
    [facetCars, cars]
  );

  const withImages = useMemo(() => cars.filter((car) => car.imageUrls?.length), [cars]);

  return (
    <div className="w-full bg-white">
      <div className="bg-charcoal-black">
        <HeroShowcase />
      </div>
      <SearchPanel facets={facets} loading={facetsLoading && !facetCars.length} />
      <QuickActions />
      <BrowseBy facets={facets} loading={facetsLoading && !facetCars.length} />
      <FeaturedVehicles cars={withImages} loading={loading} />
      <OurServices />
      <StatsBand />
      <ExploreBand />

      {/*{showcaseCars.map((car, index) => (*/}
      {/*  <ModelShowcase*/}
      {/*    key={car.id}*/}
      {/*    car={car}*/}
      {/*    tagline={SHOWCASE_TAGLINES[index % SHOWCASE_TAGLINES.length]}*/}
      {/*    align={index % 2 === 1 ? 'right' : 'left'}*/}
      {/*  />*/}
      {/*))}*/}

      {/*<EnquireBand />*/}

      {/*<CategoryGrid />*/}

      {/*<SubscribeBand />*/}
    </div>
  );
}

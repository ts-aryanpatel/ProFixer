import React, { useState, useEffect } from 'react';
import './ServicesView.css';

const ServicesView = ({ preSelectedCategory, setPreSelectedCategory }) => {
  // Default selected category state
  const [activeCategory, setActiveCategory] = useState('Electrician');

  useEffect(() => {
    if (preSelectedCategory && catalogData[preSelectedCategory]) {
      setActiveCategory(preSelectedCategory);

      // Category select hone ke baad state clear kar sakte hain taaki normal navigation disturb na ho
      if (setPreSelectedCategory) {
        const timeoutId = setTimeout(() => {
          setPreSelectedCategory(null);
        }, 100);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [preSelectedCategory, setPreSelectedCategory]);

  // Full structural database simulation for services catalog
  const catalogData = {
    'Electrician': {
      title: 'Electrical Services',
      bannerIcon: '⚡',
      items: [
        { id: 'e1', name: 'Ceiling Fan Repair', price: '₹129', time: '25 mins', desc: 'Fixing motor noise, winding issues, capacitor replacement, or speed regulation faults.' },
        { id: 'e2', name: 'Geyser Service', price: '₹349', time: '40 mins', desc: 'Complete thermostat check, heating element descaling, and safety valve inspection.' },
        { id: 'e3', name: 'Exhaust Fan Repair', price: '₹99', time: '20 mins', desc: 'Oil lubrication, blade balancing, or motor jam removal for kitchen/bathroom fans.' },
        { id: 'e4', name: 'Inverter/Battery Service', price: '₹249', time: '30 mins', desc: 'Distilled water top-up, terminal cleaning to prevent corrosion, and voltage load testing.' },
        { id: 'e5', name: 'Doorbell Installation/Repair', price: '₹79', time: '15 mins', desc: 'Fixing button connectivity, buzzer replacement, or new wireless chime configuration.' },
        { id: 'e6', name: 'Switchboard/Socket Repair', price: '₹99', time: '20 mins', desc: 'Fixing loose internal wiring, replacing burnt switches, or installing new 6/16A power sockets.' },
        { id: 'e7', name: 'Light Fitting', price: '₹89', time: '15 mins', desc: 'Installation of LED batten, fancy hanging lights, wall lamps, or panel lights with brackets.' },
        { id: 'e8', name: 'Tv Mounting', price: '₹299', time: '35 mins', desc: 'Precision wall drilling, bracket leveling check, and safe mounting of LED/LCD TVs up to 55 inches.' },
        { id: 'e9', name: 'MCB/Fuse Replacement', price: '₹149', time: '20 mins', desc: 'Replacing faulty or frequently tripping MCBs/Fuses with correct load-rated alternatives.' },
        { id: 'e10', name: 'New Internal Wiring', price: '₹1299', time: '150 mins', desc: 'Fresh PVC conduit casing-capping layout and standard internal wire pulling per point/room.' },
        { id: 'e11', name: 'Short Circuit Detection', price: '₹499', time: '60 mins', desc: 'Advanced troubleshooting of faulty internal dead lines, leakage detection using multi-meters.' },
        { id: 'e12', name: 'Main Line/Meter Wiring', price: '₹799', time: '90 mins', desc: 'Heavy-duty main wire layout from government pole/substation meter to home distribution board.' },
        { id: 'e13', name: 'Concealed Wiring Repair', price: '₹699', time: '80 mins', desc: 'Tracing internal wall pipe blockages, fixing burnt wires inside wall boxes without major breakage.' }
      ]
    },
    'Plumber': {
      title: 'Plumbing Solutions',
      bannerIcon: '🚰',
      items: [
        { id: 'p1', name: 'Tap/Faucet Repair', price: '₹129', time: '25 mins', desc: 'Fixing constant dripping, replacing internal spindles, washers, or installing new fancy taps.' },
        { id: 'p2', name: 'Wash Basin & Sink Repair', price: '₹199', time: '30 mins', desc: 'Fixing loose wall brackets, bottle-trap leaks, or replacing damaged coupling and waste pipes.' },
        { id: 'p3', name: 'Toilet/Commode Repair', price: '₹349', time: '45 mins', desc: 'Fixing flush tank leakage, replacing dual-flush valves, ball-cocks, or seat cover replacement.' },
        { id: 'p4', name: 'Pipe Leakage', price: '₹249', time: '40 mins', desc: 'Locating and repairing hairline cracks or broken joints in exposed GI/CPVC/PVC pipes.' },
        { id: 'p5', name: 'Shower/Jet Spray Fix', price: '₹99', time: '20 mins', desc: 'Unclogging blocked shower heads, repairing or replacing leaking hand-jets and braided hoses.' },
        { id: 'p6', name: 'Water Tank Cleaning', price: '₹999', time: '90 mins', desc: 'High-pressure machine washing, scrubbing, vacuuming sludge, and complete anti-bacterial treatment.' },
        { id: 'p7', name: 'Water Meter/Motor Installation', price: '₹599', time: '60 mins', desc: 'Fitting new water meters or domestic booster pumps with non-return valves and bypass lines.' },
        { id: 'p8', name: 'Geyser Piping', price: '₹299', time: '35 mins', desc: 'Installing heavy-duty stainless steel connection pipes and safety angles for hot/cold inlet.' },
        { id: 'p9', name: 'New Bathroom Fitting', price: '₹1499', time: '120 mins', desc: 'Complete premium fitting of towel rods, soap holders, mirrors, health faucets, and wall mixers.' },
        { id: 'p10', name: 'Water Purifier (RO) Inlet', price: '₹149', time: '20 mins', desc: 'Installing heavy-duty brass diverter valves and feed-water adapters from main line for RO input.' },
        { id: 'p11', name: 'Toilet Blockage Clear', price: '₹399', time: '45 mins', desc: 'Clearing tough choking and blockages inside Indian or Western commodes using professional plungers/snakes.' },
        { id: 'p12', name: 'Sewage Pipe Cleaning', price: '₹799', time: '80 mins', desc: 'Deep clearing of primary drain chambers, gully traps, and main sewage lines using flexible steel rods.' },
        { id: 'p13', name: 'Rainwater Pipe Fix', price: '₹449', time: '50 mins', desc: 'Repairing or re-aligning 4-inch rooftop PVC drain pipes to prevent wall dampness during monsoons.' }
      ]
    },
    'AC & Appliance Repair': {
      title: 'AC & Appliance Repair',
      bannerIcon: '❄️',
      items: [
        { id: 'a1', name: 'AC Wet Service', price: '₹499', time: '45 mins', desc: 'High-pressure jet pump cleaning of indoor coils, outdoor units, and drain tray.' },
        { id: 'a2', name: 'AC Gas Charging', price: '₹1799', time: '90 mins', desc: 'Complete leak testing, vacuuming, and filling full gas to restore premium cooling.' },
        { id: 'a3', name: 'AC Installation/Uninstallation', price: '₹799', time: '60 mins', desc: 'Precision wall mounting or safe dismantling of indoor and outdoor units with gas locking.' },
        { id: 'a4', name: 'AC Repair (General Fault)', price: '₹299', time: '35 mins', desc: 'Diagnosis of sudden cutting, sensor issues, or remote connectivity faults.' },
        { id: 'a5', name: 'Split/Window AC Specific Fixes', price: '₹449', time: '40 mins', desc: 'Fixing swing blade motor, blower noise, or window AC heavy vibration issues.' },
        { id: 'ap1', name: 'Fridge Gas Refill', price: '₹1499', time: '60 mins', desc: 'Gas charging and capillary tube cleaning for single/double door refrigerators.' },
        { id: 'ap2', name: 'Thermostat/Relay Replacement', price: '₹399', time: '30 mins', desc: 'Replacing faulty compressor starters or automatic temperature cutoff sensors.' },
        { id: 'ap3', name: 'Door Gasket Change', price: '₹249', time: '25 mins', desc: 'Replacing loose or magnetic rubber seals to prevent cool air leakage.' },
        { id: 'ap4', name: 'Single/Double Door Specialist Fix', price: '₹499', time: '45 mins', desc: 'Advanced troubleshooting of defrost timers, bimetal faults, or fan motor failure.' },
        { id: 'ap5', name: 'Washing Machine Drum/Motor Repair', price: '₹899', time: '90 mins', desc: 'Fixing spin issues, noisy bearings, or rewinding/replacing washing machine motors.' },
        { id: 'ap6', name: 'Water Inlet/Drain Issue Fix', price: '₹199', time: '30 mins', desc: 'Unclogging water valves, fixing drain bellows, or replacing inlet pipes.' },
        { id: 'ap7', name: 'Washing Machine PCB Repair', price: '₹1199', time: '60 mins', desc: 'Repairing or resetting dead or faulty motherboard program circuits.' },
        { id: 'ap8', name: 'Top Load vs Front Load Service', price: '₹499', time: '50 mins', desc: 'Deep scale cleaning and drum descaling specific to automatic machine variants.' },
        { id: 'ap9', name: 'Microwave/Oven Repair', price: '₹349', time: '40 mins', desc: 'Fixing heating errors, touchpad unresponsive bugs, or replacing faulty magnetrons.' },
        { id: 'ap10', name: 'Water Purifier (RO) Service', price: '₹499', time: '45 mins', desc: 'Filter cleaning, TDS configuration, and sediment/pre-carbon filter checkup.' },
        { id: 'ap11', name: 'Chimney Cleaning', price: '₹599', time: '75 mins', desc: 'Thorough degreasing of filters, inner mesh, and motor baffle plates.' },
        { id: 'ap12', name: 'Geyser Repair', price: '₹299', time: '35 mins', desc: 'Fixing non-heating issues, replacing thermostats, or checking tank leaks.' }
      ]
    },
    'Carpenter': {
      title: 'Carpentry Services',
      bannerIcon: '🪚',
      items: [
        { id: 'cp1', name: 'Door Lock/Handle Installation', price: '₹199', time: '30 mins', desc: 'Precision drilling and fitting of mortise locks, cylindrical locks, or designer handles.' },
        { id: 'cp2', name: 'Hinge Repair', price: '₹99', time: '20 mins', desc: 'Fixing loose or creaking cabinet hinges, alignment correction, or replacing hydraulic hinges.' },
        { id: 'cp3', name: 'Drawer Channel Replacement', price: '₹249', time: '40 mins', desc: 'Replacing broken or jammed drawer tracks with smooth, heavy-duty telescopic slider channels.' },
        { id: 'cp4', name: 'Chair/Table Repair', price: '₹149', time: '35 mins', desc: 'Strengthening loose joints, fixing broken legs, or re-tightening under-table supports.' },
        { id: 'cp5', name: 'Bed Support Fix', price: '₹399', time: '50 mins', desc: 'Repairing broken ply supports, replacing center beams, or fixing hydraulic lift-up issues.' },
        { id: 'cp6', name: 'Furniture Assembly', price: '₹499', time: '60 mins', desc: 'Professional assembly of flat-pack furniture like study tables, shoe racks, or chest of drawers.' },
        { id: 'cp7', name: 'TV Wall Unit Setup', price: '₹799', time: '90 mins', desc: 'Heavy drilling and secure wall-mounting of floating TV units with proper wire-management check.' },
        { id: 'cp8', name: 'Curtain Rod & Blinds Installation', price: '₹129', time: '25 mins', desc: 'Fixing brackets and mounting standard curtain rods or roller/venetian blinds perfectly leveled.' },
        { id: 'cp9', name: 'Wall Shelf Mounting', price: '₹99', time: '20 mins', desc: 'Drilling and installing wooden floating shelves or heavy-duty corner brackets.' },
        { id: 'cp10', name: 'Wardrobe/Almirah Repair', price: '₹349', time: '45 mins', desc: 'Fixing jammed sliding door tracks, adjusting magnet catches, or replacing internal hanging rods.' },
        { id: 'cp11', name: 'Modular Kitchen Repair', price: '₹599', time: '75 mins', desc: 'Adjusting tandem boxes, fixing hydraulic auto-close lifts, or re-aligning shutters.' },
        { id: 'cp12', name: 'Wood Polishing', price: '₹899', time: '120 mins', desc: 'Sanding old surfaces and applying a fresh coat of high-gloss or matte touch-up wood polish.' },
        { id: 'cp13', name: 'Mesh Door Install/Repair', price: '₹449', time: '60 mins', desc: 'Fixing loose wire meshes, replacing mosquito nets, or aligning secondary wire-mesh doors.' }
      ]
    },
    'Painter': {
      title: 'Painting & Waterproofing',
      bannerIcon: '🎨',
      items: [
        { id: 'pt1', name: 'Full Interior House Paint', price: '₹9999', time: '1-3 Days', desc: 'Complete end-to-end interior walls painting with masking protection and post-cleanup.' },
        { id: 'pt2', name: 'Single Room Painting', price: '₹1999', time: '1 Day', desc: 'Thorough standard emulsion coating for walls and ceiling of a single standard room.' },
        { id: 'pt3', name: 'Wall Putty & Priming', price: '₹499', time: '180 mins', desc: 'Applying multi-layer smooth wall putty and sealer primer base to prepare for fresh paint.' },
        { id: 'pt4', name: 'Feature/Accent Wall', price: '₹1199', time: '120 mins', desc: 'Premium luxury emulsion coating with vibrant custom shades on a single main focus wall.' },
        { id: 'pt5', name: 'Exterior House Paint', price: '₹14999', time: '2-5 Days', desc: 'Heavy-duty weather-proof external wall painting with crack bridging basecoat coatings.' },
        { id: 'pt6', name: 'Waterproofing', price: '₹2499', time: '240 mins', desc: 'Advanced chemical liquid membrane application on roofs or terraces to stop heavy water leakages.' },
        { id: 'pt7', name: 'Anti-Damp Treatment', price: '₹899', time: '90 mins', desc: 'Scraping loose wall flakes, injection of anti-damp solution, and protective seal coating.' },
        { id: 'pt8', name: 'Wall Patch Repair', price: '₹299', time: '45 mins', desc: 'Filling deep cracks, fixing old nail holes, surface leveling, and matching touch-up paint.' },
        { id: 'pt9', name: 'Grill & Gate Painting', price: '₹799', time: '120 mins', desc: 'Rust removal scraping followed by premium anti-corrosive oil primer and gloss enamel paint.' },
        { id: 'pt10', name: 'Stencil Painting', price: '₹1499', time: '90 mins', desc: 'Creative designer stencil pattern replication on a wall using premium dynamic colors.' },
        { id: 'pt11', name: 'Wall Texture Design', price: '₹2999', time: '180 mins', desc: 'Application of metallic/non-metallic premium textures (like Royale Play styles) using special rollers.' },
        { id: 'pt12', name: 'Wood & Metal Polishing', price: '₹1299', time: '150 mins', desc: 'Fine sanding and re-applying high-gloss PU polish, melamine coating, or enamel touch-ups.' }
      ]
    },
    'Salon & Grooming': {
      title: 'Salon & Grooming',
      bannerIcon: '✂️',
      items: [
        { id: 's1', name: "Men's Haircut", price: '₹149', time: '30 mins', desc: 'Professional haircut with custom hair wash, basic neck massage, and styling gel application.' },
        { id: 's2', name: 'Beard Shape & Styling', price: '₹99', time: '20 mins', desc: 'Precision razor trimming, sharp line detailing, and soothing after-shave oil therapy.' },
        { id: 's3', name: "Men's Facial & Cleanup", price: '₹499', time: '45 mins', desc: 'Deep skin cleansing, multi-layer pore scrub exfoliation, and targeted charcoal blackhead removal.' },
        { id: 's4', name: 'Hair Color/Dye Application', price: '₹199', time: '30 mins', desc: 'Mess-free, even root touch-up or full hair color application (product provided by client).' },
        { id: 's5', name: 'Head Massage', price: '₹149', time: '20 mins', desc: 'Relaxing acupressure head massage using premium ayurvedic mahabhringraj or cooling oils.' },
        { id: 's6', name: 'Women\'s Haircut', price: '₹399', time: '45 mins', desc: 'Advanced split-ends trimming, layer/step cuts by top-rated stylists with standard hair drying.' },
        { id: 's7', name: 'Women\'s Hair Coloring', price: '₹599', time: '60 mins', desc: 'Professional full-length hair color or highlights application with safe ear-guard protections.' },
        { id: 's8', name: 'Hair Spa & Treatment', price: '₹899', time: '75 mins', desc: 'Deep nourishing root cream mask, ozone steam therapy, and smoothing anti-frizz serum lock.' },
        { id: 's9', name: 'Blow Dry & Styling', price: '₹249', time: '30 mins', desc: 'Premium volume blow-dry styling with options for heat straightener or beachy curls look.' },
        { id: 's10', name: 'Women\'s Facial & Cleanup', price: '₹699', time: '50 mins', desc: 'Premium fruit/gold facial pack application for deep hydration, pore tightening, and glow.' },
        { id: 's11', name: 'Waxing (Full Arms & Legs)', price: '₹349', time: '40 mins', desc: 'Smooth hair removal using hygienic warm honey or premium rica wax with post-wax wipes.' },
        { id: 's12', name: 'Threading (Eyebrows & Upper Lip)', price: '₹49', time: '15 mins', desc: 'Precision organic thread shaping for eyebrows and upper lip with soothing aloe vera gel finish.' },
        { id: 's13', name: 'Manicure & Pedicure', price: '₹599', time: '60 mins', desc: 'Luxury hand and feet soak, nail filing, cuticle care, dead skin scrubbing, and relaxing massage.' },
        { id: 's14', name: 'Bleach & Detan', price: '₹249', time: '25 mins', desc: 'Oxylife bleach or premium O3+ detan cream pack to remove stubborn sun-tan instantly.' },
        { id: 's15', name: 'Bridal/Groom Makeup', price: '₹6999', time: '180 mins', desc: 'HD premium waterproof bridal/groom makeup packages including hair setting and outfit assist.' },
        { id: 's16', name: 'Party Makeup', price: '₹1999', time: '90 mins', desc: 'Lightweight elegant party look makeup with matching eye shadow, base layout, and hair curls.' },
        { id: 's17', name: 'Saree Draping', price: '₹299', time: '25 mins', desc: 'Perfect traditional or modern style saree pleating, pinning, and neat draping support.' }
      ]
    },
    'Cleaning & Pest Control': {
      title: 'Cleaning & Pest Control',
      bannerIcon: '🧹',
      items: [
        { id: 'c1', name: 'Full House Deep Cleaning', price: '₹2999', time: '240 mins', desc: 'Complete intensive dusting, vacuuming, floor scrubbing, window wiping, and sanitization of the entire house.' },
        { id: 'c2', name: 'Kitchen Deep Cleaning', price: '₹999', time: '120 mins', desc: 'Deep degreasing of oil stains from walls, slabs, cabinets, tiles, exhaust fans, and external chimney cleaning.' },
        { id: 'c3', name: 'Bathroom Deep Cleaning', price: '₹349', time: '60 mins', desc: 'Removal of hard water scales from tiles, taps, mirror, and deep anti-bacterial sanitization of the WC.' },
        { id: 'c4', name: 'Balcony & Terrace Cleaning', price: '₹199', time: '40 mins', desc: 'High-pressure washing of balcony floors, railing wiping, and clearing of dry leaves or mud.' },
        { id: 'c5', name: 'Sofa/Couch Cleaning', price: '₹499', time: '50 mins', desc: 'Dry vacuuming followed by eco-friendly chemical foam shampooing and extraction for a standard 3-seater sofa.' },
        { id: 'c6', name: 'Mattress Cleaning', price: '₹399', time: '45 mins', desc: 'Urine stain removal treatment and deep steam vacuuming to eliminate dust mites from a double-bed mattress.' },
        { id: 'c7', name: 'Carpet/Rug Shampooing', price: '₹299', time: '35 mins', desc: 'Heavy-duty fabric injection-extraction wash to remove embedded dirt and bad odors from standard carpets.' },
        { id: 'c8', name: 'Curtain & Blind Cleaning', price: '₹149', time: '30 mins', desc: 'On-site vacuuming and dry cleaning of premium heavy curtains or roller blinds per panel.' },
        { id: 'c9', name: 'General Pest Control', price: '₹699', time: '45 mins', desc: 'Odourless herbal gel and spray combination treatment targeting ants, spiders, and common crawling insects.' },
        { id: 'c10', name: 'Termite Control', price: '₹1499', time: '90 mins', desc: 'Advanced wood-drilling chemical injection technology to destroy entire termite colonies with a warranty.' },
        { id: 'c11', name: 'Bed Bug Treatment', price: '₹899', time: '60 mins', desc: 'Two-phase intense chemical spray layout on mattresses, folds, and cracks to completely eliminate bed bugs.' },
        { id: 'c12', name: 'Rodent/Rat Control', price: '₹399', time: '30 mins', desc: 'Placing strategic multi-dose bait stations and industrial-grade glue traps across entry points.' },
        { id: 'c13', name: 'Anti-Mosquito Treatment', price: '₹499', time: '40 mins', desc: 'Wall spray and indoor/outdoor thermal fogging treatment to disrupt mosquito breeding cycles.' }
      ]
    }
  };

  const currentCat = catalogData[activeCategory];

  return (
    <div className="services-catalog-container">
      <div className="catalog-header">
        <h2 className="section-main-title">Explore Our Service Catalog</h2>
        <p className="section-subtitle-text">Select a category to view individual service cards, timelines, and dynamic rate cards.</p>
      </div>

      <div className="catalog-layout-grid">

        {/* LEFT COLUMN: CATEGORY SELECTOR TABS */}
        <aside className="catalog-sidebar-nav">
          {Object.keys(catalogData).map((catKey) => (
            <button
              key={catKey}
              className={`cat-nav-link ${activeCategory === catKey ? 'active' : ''}`}
              onClick={() => setActiveCategory(catKey)}
            >
              <span className="cat-nav-icon">{catalogData[catKey].bannerIcon}</span> {catKey}
            </button>
          ))}
        </aside>

        {/* RIGHT COLUMN: DETAILED MICRO-SERVICES CARDS */}
        <main className="catalog-items-display">
          <div className="current-cat-banner">
            <span className="banner-big-icon">{currentCat?.bannerIcon}</span>
            <div>
              <h3>{currentCat?.title}</h3>
              <p>{currentCat?.items ? currentCat.items.length : 0} services available inside this section</p>
            </div>
          </div>

          <div className="micro-services-vertical-stack">
            {currentCat?.items.map((item) => (
              <div key={item.id} className="micro-service-item-card">
                <div className="item-details-left">
                  <h4>{item.name}</h4>
                  <div className="item-meta-row">
                    <span className="meta-time">⏱️ {item.time}</span>
                    <span className="meta-divider">•</span>
                    <span className="meta-price">Base Price: <strong>{item.price}</strong></span>
                  </div>
                  <p className="item-description-text">{item.desc}</p>
                </div>

                <div className="item-action-right">
                  <button className="add-to-cart-btn">
                    View All Service Providers <span className="arrow-sign">&rarr;</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

      </div>
    </div>
  );
};

export default ServicesView;
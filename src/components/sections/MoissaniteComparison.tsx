'use client';

import { Sparkles, Shield, Award } from 'lucide-react';

const comparisonData = [
  {
    property: 'Hardness (Mohs Scale)',
    moissanite: '9.25 (Extremely Durable)',
    diamond: '10 (Hardest)',
    cz: '8.0 (Easily Scratches)',
    highlight: true,
  },
  {
    property: 'Brilliance Index (Refractive Index)',
    moissanite: '2.65 - 2.69 (Outshines Diamond)',
    diamond: '2.42',
    cz: '2.15 (Dull over time)',
    highlight: true,
  },
  {
    property: 'Fire & Dispersion (Rainbow Sparkle)',
    moissanite: '0.104 (2.4x More Fire than Diamond)',
    diamond: '0.044',
    cz: '0.060',
    highlight: true,
  },
  {
    property: 'Passes Diamond Testers?',
    moissanite: 'YES (Thermo-Conductive)',
    diamond: 'YES',
    cz: 'NO (Fails immediately)',
    highlight: false,
  },
  {
    property: 'Color & Clarity Grade',
    moissanite: 'VVS1 Clarity • D-Color Colorless',
    diamond: 'Varies (High cost for VVS/D)',
    cz: 'Synthetic Glass Grade',
    highlight: false,
  },
  {
    property: 'Environmental & Ethical Impact',
    moissanite: '100% Conflict-Free & Sustainable',
    diamond: 'High Ecological Footprint',
    cz: 'Synthetic Mass Produced',
    highlight: false,
  },
  {
    property: 'Lifetime Durability & Shine',
    moissanite: 'Guaranteed Forever (Never Fades)',
    diamond: 'Forever',
    cz: 'Clouds within 1-2 years',
    highlight: true,
  },
  {
    property: 'Price for 2.00 Carat Solitaire',
    moissanite: '₹3,499 - ₹4,999 (Affordable Luxury)',
    diamond: '₹3,00,000 - ₹8,00,000+',
    cz: '₹500 - ₹1,000 (No Resale)',
    highlight: true,
  },
];

export default function MoissaniteComparison() {
  return (
    <section id="comparison" className="py-20 bg-[#FDFBF7] border-t border-[#E8E5DF]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4E8C1]/60 text-[#8C6A1F] rounded-full text-xs font-sans font-bold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            The Science of Brilliance
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#18181B] mb-4">
            Moissanite vs. Mined Diamond vs. Cubic Zirconia
          </h2>
          <div className="w-20 h-[1.5px] bg-[#B89035] mx-auto mb-6" />
          <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed">
            Moissanite was originally discovered in a meteorite crater by Nobel Prize-winning scientist Dr. Henri Moissan. Today, our lab master jewelers cut it with higher fire, greater brilliance, and identical diamond thermal-tester performance at a fraction of the cost.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto bg-white rounded-2xl border border-[#E8E5DF] shadow-luxury">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#E8E5DF] bg-[#F7F5F0]">
                <th className="p-5 font-serif text-base font-bold text-[#18181B] w-1/4">
                  Feature / Property
                </th>
                <th className="p-5 font-serif text-lg font-bold text-[#8C6A1F] bg-[#F4E8C1]/30 border-x border-[#D4AF37]/30 w-1/3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#B89035]" />
                    <span>AURA Moissanite</span>
                  </div>
                  <span className="block font-sans text-[10px] font-normal text-gray-600 uppercase tracking-widest mt-0.5">
                    VVS1 • D-Color • GRA Certified
                  </span>
                </th>
                <th className="p-5 font-serif text-base font-bold text-gray-700 w-1/5 text-center">
                  Mined Diamond
                </th>
                <th className="p-5 font-serif text-base font-bold text-gray-400 w-1/5 text-center">
                  Cubic Zirconia (CZ)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E5DF] text-xs sm:text-sm font-sans">
              {comparisonData.map((row, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-[#FDFBF7] transition-colors ${
                    row.highlight ? 'bg-amber-50/20' : ''
                  }`}
                >
                  <td className="p-4 sm:p-5 font-medium text-[#18181B]">
                    {row.property}
                  </td>
                  <td className="p-4 sm:p-5 font-bold text-[#064E3B] bg-[#F4E8C1]/20 border-x border-[#D4AF37]/20 text-center">
                    {row.moissanite}
                  </td>
                  <td className="p-4 sm:p-5 text-gray-600 text-center">
                    {row.diamond}
                  </td>
                  <td className="p-4 sm:p-5 text-gray-400 text-center">
                    {row.cz}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Value Callout Banner */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border border-[#E8E5DF] flex items-start gap-4">
            <Award className="w-8 h-8 text-[#B89035] flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-serif text-lg font-bold text-[#18181B] mb-1">
                Passes Diamond Testers
              </h4>
              <p className="font-sans text-xs text-gray-600">
                Because Moissanite conducts heat identically to natural diamond, electronic diamond testers detect it positively as diamond.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-[#E8E5DF] flex items-start gap-4">
            <Sparkles className="w-8 h-8 text-[#B89035] flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-serif text-lg font-bold text-[#18181B] mb-1">
                2.4x More Sparkle & Fire
              </h4>
              <p className="font-sans text-xs text-gray-600">
                Moissanite has a dispersion of 0.104 compared to diamond's 0.044, yielding mesmerizing rainbow flashes under any lighting.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-[#E8E5DF] flex items-start gap-4">
            <Shield className="w-8 h-8 text-[#064E3B] flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-serif text-lg font-bold text-[#18181B] mb-1">
                Lifetime Forever Warranty
              </h4>
              <p className="font-sans text-xs text-gray-600">
                Hardness of 9.25 on Mohs scale means it never clouds, never loses its luster, and resists everyday chipping or scratching.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

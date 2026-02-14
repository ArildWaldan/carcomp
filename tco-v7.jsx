import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const REF_KM_YEAR = 12000;
const YEARS = 10;

const SCENARIOS = [
  {
    id: "r5_40",
    name: "R5 40 kWh",
    emoji: "⚡",
    tag: "Neuf",
    color: "#F7B731",
    catalogPrice: 24990,
    bonus: 4700,
    surbonus: 1200,
    tradeIn: 1500,
    kwh100km: 15.0,
    chargingEfficiency: 0.88,
    isEV: true,
    isNew: true,
    startingKm: 0,
    startingAge: 0,
    insuranceYr: 580,
    maintenanceYr1: 180,
    maintenanceGrowth: 0.06,
    tiresCostPerKm: 0.013,
    ctYr: 35,
    resaleByYear: [24990, 20000, 16500, 11000, 9500, 8500, 7500, 6700, 5900, 5400, 5000],
    resaleDecayRate: 0.0018,
    resaleFloor: 0.25,
    notes: "Entrée de gamme, batterie 40 kWh, produite à Douai.",
  },
  {
    id: "r5_52",
    name: "R5 52 kWh",
    emoji: "⚡",
    tag: "Neuf",
    color: "#FC5C65",
    catalogPrice: 31490,
    bonus: 4700,
    surbonus: 1200,
    tradeIn: 1500,
    kwh100km: 15.5,
    chargingEfficiency: 0.88,
    isEV: true,
    isNew: true,
    startingKm: 0,
    startingAge: 0,
    insuranceYr: 620,
    maintenanceYr1: 180,
    maintenanceGrowth: 0.06,
    tiresCostPerKm: 0.013,
    ctYr: 35,
    resaleByYear: [31490, 25200, 20500, 14000, 12500, 11000, 9700, 8700, 7800, 7100, 6500],
    resaleDecayRate: 0.0018,
    resaleFloor: 0.25,
    notes: "Version confort, meilleure autonomie (+100 km). Finition Techno.",
  },
  {
    id: "e2008",
    name: "e-2008 50kWh",
    emoji: "🦁",
    tag: "Occasion 2023",
    color: "#45AAF2",
    catalogPrice: 17499,
    bonus: 0,
    surbonus: 0,
    tradeIn: 1500,
    kwh100km: 17.0,
    chargingEfficiency: 0.88,
    isEV: true,
    isNew: false,
    startingKm: 26900,
    startingAge: 2.5,
    insuranceYr: 550,
    maintenanceYr1: 220,
    maintenanceGrowth: 0.07,
    tiresCostPerKm: 0.013,
    ctYr: 35,
    resaleByYear: [17499, 15500, 14000, 12000, 10500, 9200, 8000, 7000, 6200, 5500, 5000],
    resaleDecayRate: 0.0020,
    resaleFloor: 0.20,
    notes: "SUV compact EV Stellantis, 27k km. Charge rapide 100 kW, chargeur 11kW tri. 320 km WLTP.",
  },
  {
    id: "ec4_2022",
    name: "ë-C4 Shine 2022",
    emoji: "🔴",
    tag: "Occasion 2022",
    color: "#26DE81",
    catalogPrice: 17399,
    bonus: 0,
    surbonus: 0,
    tradeIn: 1500,
    kwh100km: 17.0,
    chargingEfficiency: 0.88,
    isEV: true,
    isNew: false,
    startingKm: 7471,
    startingAge: 3.3,
    insuranceYr: 530,
    maintenanceYr1: 200,
    maintenanceGrowth: 0.07,
    tiresCostPerKm: 0.013,
    ctYr: 35,
    resaleByYear: [17399, 15200, 13500, 11500, 10000, 8800, 7600, 6600, 5800, 5200, 4600],
    resaleDecayRate: 0.0020,
    resaleFloor: 0.20,
    notes: "Berline EV 50 kWh, seulement 7 500 km — quasi neuve. Charge rapide 100 kW. 350 km WLTP.",
  },
  {
    id: "ec4_2024",
    name: "E-C4 2024",
    emoji: "⚪",
    tag: "Occasion 2024",
    color: "#2BCBBA",
    catalogPrice: 18999,
    bonus: 0,
    surbonus: 0,
    tradeIn: 1500,
    kwh100km: 16.5,
    chargingEfficiency: 0.88,
    isEV: true,
    isNew: false,
    startingKm: 9554,
    startingAge: 1.3,
    insuranceYr: 540,
    maintenanceYr1: 190,
    maintenanceGrowth: 0.06,
    tiresCostPerKm: 0.013,
    ctYr: 35,
    resaleByYear: [18999, 17000, 15200, 13000, 11500, 10200, 9000, 8000, 7200, 6500, 5800],
    resaleDecayRate: 0.0020,
    resaleFloor: 0.20,
    notes: "Modèle oct. 2024, 9 500 km, chargeur 11 kW, max garantie restante. 360 km WLTP.",
  },
  {
    id: "arkana",
    name: "Arkana E-Tech 145",
    emoji: "🌿",
    tag: "Occasion 2023",
    color: "#FD9644",
    catalogPrice: 19290,
    bonus: 0,
    surbonus: 0,
    tradeIn: 1500,
    l100km: 5.5,
    isEV: false,
    isHybrid: true,
    isNew: false,
    startingKm: 30200,
    startingAge: 3,
    insuranceYr: 600,
    maintenanceYr1: 400,
    maintenanceGrowth: 0.08,
    tiresCostPerKm: 0.010,
    ctYr: 60,
    resaleByYear: [19290, 17000, 15000, 13000, 11500, 10000, 8800, 7800, 7000, 6300, 5700],
    resaleDecayRate: 0.0018,
    resaleFloor: 0.15,
    notes: "SUV coupé hybride full 145ch, 30k km. 5,5 L/100 réel, boîte crabots. Zéro angoisse autonomie.",
  },
  {
    id: "ds3",
    name: "DS3 E-Tense 2020",
    emoji: "💎",
    tag: "Occasion 2020",
    color: "#A55EEA",
    catalogPrice: 16499,
    bonus: 0,
    surbonus: 0,
    tradeIn: 1500,
    kwh100km: 17.5,
    chargingEfficiency: 0.88,
    isEV: true,
    isNew: false,
    startingKm: 12493,
    startingAge: 6,
    insuranceYr: 500,
    maintenanceYr1: 280,
    maintenanceGrowth: 0.09,
    tiresCostPerKm: 0.013,
    ctYr: 35,
    resaleByYear: [16499, 14000, 12000, 10500, 9000, 7800, 6800, 6000, 5300, 4700, 4200],
    resaleDecayRate: 0.0025,
    resaleFloor: 0.15,
    notes: "Premium DS, 12 500 km, 46 kWh (gen1). Déjà 6 ans → risque batterie dès an 2. Pièces DS chères.",
  },
];

// ── CORE CALCULATIONS ──

function getNetPurchase(s, inclSurbonus) {
  // Trade-in excluded: it's the user's existing asset (cash), not a discount on the new car
  return s.catalogPrice - s.bonus - (inclSurbonus ? s.surbonus : 0);
}

function getResale(s, year, kmYear) {
  if (year <= 0) return s.resaleByYear[0];
  const idx = Math.min(year, YEARS);
  const f = Math.floor(idx);
  const c = Math.min(Math.ceil(idx), YEARS);
  let baseResale;
  if (f === c) { baseResale = s.resaleByYear[f]; }
  else { const r = idx - f; baseResale = s.resaleByYear[f] * (1 - r) + s.resaleByYear[c] * r; }

  const actualKm = s.startingKm + kmYear * year;
  const expectedKm = s.startingKm + REF_KM_YEAR * year;
  const excessKm = actualKm - expectedKm;

  if (excessKm <= 0) {
    const bonusFactor = 1 - Math.exp(-Math.abs(excessKm) * 0.00003);
    const bonus = Math.min(0.15, bonusFactor * 0.20);
    let resale = Math.round(baseResale * (1 + bonus));
    // Battery degradation risk: 15% haircut on EV resale past 8 years total age or 160,000 km
    if (s.isEV) {
      const totalKm = s.startingKm + kmYear * year;
      const vehicleAge = (s.startingAge || 0) + year;
      if (vehicleAge >= 8 || totalKm >= 160000) {
        resale = Math.round(resale * 0.85);
      }
    }
    return resale;
  }

  const maxPenalty = 1 - s.resaleFloor;
  const penalty = maxPenalty * (1 - Math.exp(-s.resaleDecayRate * excessKm));
  let resale = Math.round(baseResale * (1 - penalty));

  // Battery degradation risk: 15% haircut on EV resale past 8 years total age or 160,000 km
  if (s.isEV) {
    const totalKm = s.startingKm + kmYear * year;
    const vehicleAge = (s.startingAge || 0) + year;
    if (vehicleAge >= 8 || totalKm >= 160000) {
      resale = Math.round(resale * 0.85);
    }
  }
  return resale;
}

function getMaintenanceForYear(s, y) {
  return s.maintenanceYr1 * Math.pow(1 + s.maintenanceGrowth, y - 1);
}

function getEnergyForYear(s, kmYear, elecBase, fuelBase, eInfl, y) {
  const m = Math.pow(1 + eInfl, y - 1);
  if (s.isEV) return (s.kwh100km / s.chargingEfficiency * kmYear) / 100 * elecBase * m;
  return (s.l100km * kmYear) / 100 * fuelBase * m;
}

function getTiresForYear(s, kmYear, gInfl, y) {
  return s.tiresCostPerKm * kmYear * Math.pow(1 + gInfl, y - 1);
}

function getInsuranceForYear(s, gInfl, y) {
  // France: insurance decreases over time due to:
  // 1. Vehicle depreciation → lower insured value → cheaper comprehensive
  // 2. Bonus-malus: ~-5%/yr claim-free, floor CRM 0.50
  // Combined effect: ~-4%/yr dampening, floor at 65% of initial (liability minimum)
  // Offset by general inflation on service costs
  const dampingFactor = Math.max(0.65, 1 - 0.04 * (y - 1));
  return s.insuranceYr * dampingFactor * Math.pow(1 + gInfl, y - 1);
}

function getCTForYear(s, gInfl, y) {
  return s.ctYr * Math.pow(1 + gInfl, y - 1);
}

function getOPEXForYear(s, kmYear, elecP, fuelP, eInfl, gInfl, y) {
  return getEnergyForYear(s, kmYear, elecP, fuelP, eInfl, y)
    + getMaintenanceForYear(s, y)
    + getInsuranceForYear(s, gInfl, y)
    + getTiresForYear(s, kmYear, gInfl, y)
    + getCTForYear(s, gInfl, y);
}

function getCumulativeOPEX(s, years, kmYear, elecP, fuelP, eInfl, gInfl) {
  let t = 0;
  for (let y = 1; y <= years; y++) t += getOPEXForYear(s, kmYear, elecP, fuelP, eInfl, gInfl, y);
  return t;
}

function getCumulative(s, year, kmYear, elecP, fuelP, eInfl, gInfl, inclSurbonus) {
  return getNetPurchase(s, inclSurbonus) + getCumulativeOPEX(s, year, kmYear, elecP, fuelP, eInfl, gInfl);
}

function getCumulativeOpportunityCost(s, year, kmYear, oppRate, inclSurbonus) {
  if (oppRate <= 0) return 0;
  const initialOutlay = getNetPurchase(s, inclSurbonus);
  return initialOutlay * (Math.pow(1 + oppRate, year) - 1);
}

function getNetPosition(s, year, kmYear, elecP, fuelP, eInfl, gInfl, inclSurbonus, oppRate) {
  return getCumulative(s, year, kmYear, elecP, fuelP, eInfl, gInfl, inclSurbonus)
    + getCumulativeOpportunityCost(s, year, kmYear, oppRate, inclSurbonus)
    - getResale(s, year, kmYear);
}

// ── UI COMPONENTS ──

function SliderControl({ label, value, onChange, min, max, step, unit, format }) {
  const fmt = format || (v => step < 1 ? v.toFixed(step < 0.1 ? 2 : 1) : v.toLocaleString("fr-FR"));
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
        <span style={{ fontSize: 10, fontFamily: "'DM Sans',sans-serif", color: "#94a3b8", letterSpacing: "0.02em", textTransform: "uppercase", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 15, fontFamily: "'Space Mono',monospace", fontWeight: 700, color: "#f1f5f9" }}>
          {fmt(value)}{unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))} style={{ width: "100%", accentColor: "#F7B731", height: 5, cursor: "pointer" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#475569", fontFamily: "'DM Sans',sans-serif" }}>
        <span>{fmt(min)}{unit}</span><span>{fmt(max)}{unit}</span>
      </div>
    </div>
  );
}

function ScenarioCard({ scenario: s, kmYear, elecP, fuelP, eInfl, gInfl, inclSurbonus, oppRate, isSelected, onToggle }) {
  const net = getNetPurchase(s, inclSurbonus);
  const tco = getNetPosition(s, YEARS, kmYear, elecP, fuelP, eInfl, gInfl, inclSurbonus, oppRate);
  const resale = getResale(s, YEARS, kmYear);
  const totalKm = s.startingKm + kmYear * YEARS;
  const avgOpex = getCumulativeOPEX(s, YEARS, kmYear, elecP, fuelP, eInfl, gInfl) / YEARS;

  return (
    <div onClick={onToggle} style={{
      background: isSelected ? `linear-gradient(135deg, ${s.color}18, ${s.color}08)` : "#0f172a",
      border: isSelected ? `2px solid ${s.color}` : "2px solid #1e293b",
      borderRadius: 16, padding: "12px 14px", cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      opacity: isSelected ? 1 : 0.4, transform: isSelected ? "scale(1)" : "scale(0.97)",
      minWidth: 145,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
        <span style={{ fontSize: 18 }}>{s.emoji}</span>
        <div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 11, color: s.color, lineHeight: 1.2 }}>{s.name}</div>
          <span style={{
            fontSize: 8, fontFamily: "'DM Sans',sans-serif",
            background: s.isNew ? "#26DE8125" : s.isHybrid ? "#2BCBBA25" : "#45AAF225",
            color: s.isNew ? "#26DE81" : s.isHybrid ? "#2BCBBA" : "#45AAF2",
            padding: "1px 6px", borderRadius: 20, fontWeight: 600, textTransform: "uppercase",
          }}>{s.tag}{s.isHybrid ? " · HEV" : ""}</span>
        </div>
      </div>
      <div style={{ display: "grid", gap: 3 }}>
        <Row label="Achat net" val={`${net.toLocaleString("fr-FR")} €`} />
        <Row label="OPEX moy./an" val={`${Math.round(avgOpex).toLocaleString("fr-FR")} €`} />
        <Row label={`Revente an ${YEARS}`} val={`${resale.toLocaleString("fr-FR")} €`} sub={`${Math.round(totalKm / 1000)}k km`} small />
        <div style={{ height: 1, background: "#1e293b", margin: "1px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700 }}>TCO {YEARS} ans</span>
          <span style={{ fontSize: 13, fontFamily: "'Space Mono',monospace", color: s.color, fontWeight: 700 }}>{Math.round(tco).toLocaleString("fr-FR")} €</span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, val, sub, small }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <span style={{ fontSize: small ? 9 : 10, color: "#64748b" }}>{label}</span>
      <span style={{ fontSize: small ? 10 : 11, fontFamily: "'Space Mono',monospace", color: "#e2e8f0", fontWeight: 600 }}>
        {val}{sub && <span style={{ fontSize: 8, color: "#475569", marginLeft: 3 }}>({sub})</span>}
      </span>
    </div>
  );
}

function CustomTooltip({ active, payload, label, chartMode }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: "#0f172aee", border: "1px solid #334155", borderRadius: 12,
      padding: "10px 14px", backdropFilter: "blur(10px)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", maxWidth: 340,
    }}>
      <div style={{ fontFamily: "'Space Mono',monospace", color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>
        Année {label} — {chartMode === "cumulative" ? "Coûts cumulés" : "Position nette (TCO)"}
      </div>
      {payload.sort((a, b) => a.value - b.value).map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: "#e2e8f0", flex: 1 }}>{p.name}</span>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: p.color, fontWeight: 700, marginLeft: 6 }}>
            {Math.round(p.value).toLocaleString("fr-FR")} €
          </span>
        </div>
      ))}
    </div>
  );
}

function BreakdownTable({ scenarios, selectedIds, kmYear, elecP, fuelP, eInfl, gInfl, inclSurbonus, oppRate }) {
  const sel = scenarios.filter(s => selectedIds.includes(s.id));
  if (!sel.length) return null;
  const rows = [
    { label: "Prix catalogue", fn: s => s.catalogPrice },
    { label: "Bonus CEE 2026", fn: s => s.bonus > 0 ? -s.bonus : 0, green: true },
    { label: "Surbonus batterie UE", fn: s => inclSurbonus && s.surbonus > 0 ? -s.surbonus : 0, green: true },
    { label: "💰 Prix d'achat net", fn: s => getNetPurchase(s, inclSurbonus), bold: true },
    { spacer: true },
    { label: "— OPEX année 1 —", header: true },
    { label: s => s.isEV ? `Électricité (${(s.kwh100km / s.chargingEfficiency).toFixed(1)} kWh/100)` : `Carburant (${s.l100km} L/100)`,
      fn: s => Math.round(getEnergyForYear(s, kmYear, elecP, fuelP, eInfl, 1)) },
    { label: "Entretien", fn: s => Math.round(getMaintenanceForYear(s, 1)) },
    { label: "Assurance", fn: s => Math.round(getInsuranceForYear(s, gInfl, 1)) },
    { label: "Pneus", fn: s => Math.round(getTiresForYear(s, kmYear, gInfl, 1)) },
    { label: "CT", fn: s => Math.round(getCTForYear(s, gInfl, 1)) },
    { label: "Total an 1", fn: s => Math.round(getOPEXForYear(s, kmYear, elecP, fuelP, eInfl, gInfl, 1)), bold: true },
    { spacer: true },
    { label: `— OPEX année ${YEARS} —`, header: true },
    { label: s => s.isEV ? "Électricité" : "Carburant",
      fn: s => Math.round(getEnergyForYear(s, kmYear, elecP, fuelP, eInfl, YEARS)) },
    { label: "Entretien", fn: s => Math.round(getMaintenanceForYear(s, YEARS)) },
    { label: "Assurance", fn: s => Math.round(getInsuranceForYear(s, gInfl, YEARS)) },
    { label: "Pneus", fn: s => Math.round(getTiresForYear(s, kmYear, gInfl, YEARS)) },
    { label: "CT", fn: s => Math.round(getCTForYear(s, gInfl, YEARS)) },
    { label: `Total an ${YEARS}`, fn: s => Math.round(getOPEXForYear(s, kmYear, elecP, fuelP, eInfl, gInfl, YEARS)), bold: true },
    { spacer: true },
    { label: `OPEX cumulé ${YEARS} ans`, fn: s => Math.round(getCumulativeOPEX(s, YEARS, kmYear, elecP, fuelP, eInfl, gInfl)), bold: true },
    ...(oppRate > 0 ? [{ label: `📈 Coût d'opportunité`, fn: s => Math.round(getCumulativeOpportunityCost(s, YEARS, kmYear, oppRate, inclSurbonus)), italic: true }] : []),
    { label: `Coûts totaux ${YEARS} ans`, fn: s => Math.round(
      getCumulative(s, YEARS, kmYear, elecP, fuelP, eInfl, gInfl, inclSurbonus)
      + getCumulativeOpportunityCost(s, YEARS, kmYear, oppRate, inclSurbonus)
    ), bold: true },
    { label: `Revente an ${YEARS}`, fn: s => -getResale(s, YEARS, kmYear), green: true },
    { label: `🏁 TCO net ${YEARS} ans`, fn: s => Math.round(getNetPosition(s, YEARS, kmYear, elecP, fuelP, eInfl, gInfl, inclSurbonus, oppRate)), bold: true, final: true },
  ];

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans',sans-serif", fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px 10px", color: "#64748b", fontWeight: 600, fontSize: 10, textTransform: "uppercase", borderBottom: "1px solid #1e293b" }} />
            {sel.map(s => (
              <th key={s.id} style={{ textAlign: "right", padding: "8px 10px", color: s.color, fontWeight: 700, fontSize: 10, borderBottom: `2px solid ${s.color}40`, fontFamily: "'Space Mono',monospace", whiteSpace: "nowrap" }}>
                {s.emoji} {s.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            if (row.spacer) return <tr key={i}><td colSpan={sel.length + 1} style={{ height: 8 }} /></tr>;
            if (row.header) return (
              <tr key={i}>
                <td colSpan={sel.length + 1} style={{ padding: "6px 10px 3px", fontSize: 10, color: "#F7B731", fontWeight: 700, fontFamily: "'Space Mono',monospace" }}>
                  {typeof row.label === "function" ? row.label(sel[0]) : row.label}
                </td>
              </tr>
            );
            return (
              <tr key={i} style={{ background: row.final ? "#F7B73108" : "transparent" }}>
                <td style={{
                  padding: "5px 10px", color: row.bold ? "#e2e8f0" : "#94a3b8",
                  fontWeight: row.bold ? 700 : 400, fontSize: row.bold ? 12 : 11,
                  fontStyle: row.italic ? "italic" : "normal", whiteSpace: "nowrap",
                }}>
                  {typeof row.label === "function" ? row.label(sel[0]) : row.label}
                </td>
                {sel.map(s => {
                  const val = row.fn(s);
                  const neg = val < 0;
                  return (
                    <td key={s.id} style={{
                      textAlign: "right", padding: "5px 10px", fontFamily: "'Space Mono',monospace",
                      fontSize: row.bold ? 12 : 11, fontWeight: row.bold ? 700 : 400,
                      fontStyle: row.italic ? "italic" : "normal",
                      color: row.final ? s.color : (row.green && neg) ? "#26DE81" : row.italic ? "#94a3b8" : row.bold ? "#f1f5f9" : "#cbd5e1",
                      whiteSpace: "nowrap",
                    }}>
                      {val === 0 ? "—" : `${neg ? "−" : ""}${Math.abs(val).toLocaleString("fr-FR")} €`}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function TCOComparator() {
  const [kmYear, setKmYear] = useState(12000);
  const [elecP, setElecP] = useState(0.21);
  const [fuelP, setFuelP] = useState(1.78);
  const [eInfl, setEInfl] = useState(0.05);
  const [gInfl, setGInfl] = useState(0.025);
  const [oppRate, setOppRate] = useState(0.03);
  const [inclOppCost, setInclOppCost] = useState(true);
  const [inclSurbonus, setInclSurbonus] = useState(true);
  const [selectedIds, setSelectedIds] = useState(SCENARIOS.map(s => s.id));
  const [activeTab, setActiveTab] = useState("chart");
  const [chartMode, setChartMode] = useState("net");

  const effectiveOpp = inclOppCost ? oppRate : 0;
  const toggleScenario = id => setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const chartData = useMemo(() => {
    const pts = [];
    for (let y = 0; y <= YEARS; y++) {
      const pt = { year: y };
      SCENARIOS.forEach(s => {
        if (selectedIds.includes(s.id)) {
          pt[s.id] = chartMode === "cumulative"
            ? getCumulative(s, y, kmYear, elecP, fuelP, eInfl, gInfl, inclSurbonus)
              + getCumulativeOpportunityCost(s, y, kmYear, effectiveOpp, inclSurbonus)
            : getNetPosition(s, y, kmYear, elecP, fuelP, eInfl, gInfl, inclSurbonus, effectiveOpp);
        }
      });
      pts.push(pt);
    }
    return pts;
  }, [kmYear, elecP, fuelP, eInfl, gInfl, inclSurbonus, selectedIds, chartMode, effectiveOpp]);

  const ranking = useMemo(() => {
    return SCENARIOS
      .filter(s => selectedIds.includes(s.id))
      .map(s => ({ ...s, tco: getNetPosition(s, YEARS, kmYear, elecP, fuelP, eInfl, gInfl, inclSurbonus, effectiveOpp) }))
      .sort((a, b) => a.tco - b.tco);
  }, [kmYear, elecP, fuelP, eInfl, gInfl, inclSurbonus, selectedIds, effectiveOpp]);

  const totalKm = kmYear * YEARS;
  const highMileage = totalKm > 150000;

  // Find cheapest/most expensive for opp cost comparison
  const selectedScenarios = SCENARIOS.filter(s => selectedIds.includes(s.id));
  const cheapestS = selectedScenarios.reduce((a, b) => getNetPurchase(a, inclSurbonus) < getNetPurchase(b, inclSurbonus) ? a : b, selectedScenarios[0]);
  const mostExpS = selectedScenarios.reduce((a, b) => getNetPurchase(a, inclSurbonus) > getNetPurchase(b, inclSurbonus) ? a : b, selectedScenarios[0]);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #020617 0%, #0f172a 100%)", color: "#e2e8f0", fontFamily: "'DM Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #1e293b", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, background: "radial-gradient(circle, #F7B73115, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
          <div style={{ fontSize: 10, color: "#F7B731", fontFamily: "'Space Mono',monospace", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 3 }}>
            Comparateur TCO v7
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, lineHeight: 1.2, color: "#f8fafc" }}>
            Coût Total de Possession — {YEARS} ans · 7 scénarios
          </h1>
          <p style={{ fontSize: 12, color: "#64748b", margin: "3px 0 0", lineHeight: 1.4 }}>
            2 R5 neufs + 5 occasions réelles (annonces fév. 2026) · Dépréciation convexe · Risque batterie · Assurance amortie · Inflation différenciée
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 14px 40px" }}>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))", gap: 8, margin: "0 0 16px" }}>
          {SCENARIOS.map(s => (
            <ScenarioCard key={s.id} scenario={s} kmYear={kmYear} elecP={elecP} fuelP={fuelP}
              eInfl={eInfl} gInfl={gInfl} inclSurbonus={inclSurbonus} oppRate={effectiveOpp}
              isSelected={selectedIds.includes(s.id)} onToggle={() => toggleScenario(s.id)} />
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 3, marginBottom: 14, background: "#0f172a", borderRadius: 10, padding: 3, border: "1px solid #1e293b" }}>
          {[
            { id: "chart", label: "📈 Graphique" },
            { id: "breakdown", label: "📊 Détail" },
            { id: "ranking", label: "🏆 Classement" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: "9px 14px", border: "none", borderRadius: 8,
              background: activeTab === tab.id ? "#1e293b" : "transparent",
              color: activeTab === tab.id ? "#f1f5f9" : "#64748b",
              fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 12, cursor: "pointer",
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chart */}
        {activeTab === "chart" && (
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 18, padding: "18px 10px 10px 0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0 10px 20px", flexWrap: "wrap", gap: 6 }}>
              <div style={{ fontSize: 11, color: "#64748b", maxWidth: 500 }}>
                {chartMode === "cumulative"
                  ? `Coûts cumulés (achat + OPEX${inclOppCost ? " + opp. cost" : ""}) — toujours croissant`
                  : `Position nette (coûts${inclOppCost ? " + opp. cost" : ""} − revente ajustée km)`}
              </div>
              <div style={{ display: "flex", background: "#020617", borderRadius: 7, padding: 2, gap: 2 }}>
                {[
                  { id: "cumulative", label: "Coûts cumulés" },
                  { id: "net", label: "Position nette" },
                ].map(m => (
                  <button key={m.id} onClick={() => setChartMode(m.id)} style={{
                    padding: "5px 10px", border: "none", borderRadius: 5,
                    background: chartMode === m.id ? "#1e293b" : "transparent",
                    color: chartMode === m.id ? "#F7B731" : "#64748b",
                    fontFamily: "'Space Mono',monospace", fontSize: 10, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                  }}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ top: 5, right: 16, left: 8, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#475569"
                  tick={{ fill: "#64748b", fontSize: 11, fontFamily: "'Space Mono',monospace" }}
                  tickFormatter={v => `An ${v}`} />
                <YAxis stroke="#475569"
                  tick={{ fill: "#64748b", fontSize: 10, fontFamily: "'Space Mono',monospace" }}
                  tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={42} />
                <Tooltip content={<CustomTooltip chartMode={chartMode} />} />
                {SCENARIOS.filter(s => selectedIds.includes(s.id)).map(s => (
                  <Line key={s.id} type="monotone" dataKey={s.id} name={s.name} stroke={s.color}
                    strokeWidth={2.5} dot={{ fill: s.color, r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 6, stroke: s.color, strokeWidth: 2, fill: "#0f172a" }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Breakdown */}
        {activeTab === "breakdown" && (
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 18, padding: 20 }}>
            <div style={{ fontSize: 10, color: "#64748b", marginBottom: 10, lineHeight: 1.5 }}>
              OPEX an 1 vs an {YEARS}. Inflation énergie {(eInfl * 100).toFixed(1)}% · générale {(gInfl * 100).toFixed(1)}%.
              Conso. EV = grille (pertes AC ~{Math.round((1 - 0.88) * 100)}%).
              {inclOppCost && ` Opp. cost : ${(oppRate * 100).toFixed(1)}% composé sur capital immobilisé.`}
            </div>
            <BreakdownTable scenarios={SCENARIOS} selectedIds={selectedIds} kmYear={kmYear}
              elecP={elecP} fuelP={fuelP} eInfl={eInfl} gInfl={gInfl} inclSurbonus={inclSurbonus} oppRate={effectiveOpp} />
          </div>
        )}

        {/* Ranking */}
        {activeTab === "ranking" && (
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 18, padding: 20 }}>
            <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 14 }}>
              Classement TCO net {YEARS} ans — {kmYear.toLocaleString("fr-FR")} km/an
              {inclOppCost && ` · opp. ${(oppRate * 100).toFixed(1)}%`}
            </div>
            {ranking.map((s, i) => {
              const best = ranking[0].tco;
              const diff = s.tco - best;
              const maxTco = ranking[ranking.length - 1].tco;
              const barW = maxTco > 0 ? (s.tco / maxTco) * 100 : 0;
              const m1 = Math.round(getMaintenanceForYear(s, 1));
              const mN = Math.round(getMaintenanceForYear(s, YEARS));
              const resaleN = getResale(s, YEARS, kmYear);
              const totKm = s.startingKm + kmYear * YEARS;
              const opp = Math.round(getCumulativeOpportunityCost(s, YEARS, kmYear, effectiveOpp, inclSurbonus));
              return (
                <div key={s.id} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "12px 0",
                  borderBottom: i < ranking.length - 1 ? "1px solid #1e293b" : "none",
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: i === 0 ? "#F7B731" : "#1e293b",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 13,
                    color: i === 0 ? "#020617" : "#64748b", flexShrink: 0,
                  }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5, flexWrap: "wrap", gap: 3 }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: s.color }}>{s.emoji} {s.name}</span>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 14, color: "#f1f5f9" }}>
                          {Math.round(s.tco).toLocaleString("fr-FR")} €
                        </span>
                        {diff > 0 && (
                          <span style={{ marginLeft: 6, fontSize: 10, color: "#ef4444", fontFamily: "'Space Mono',monospace" }}>
                            +{Math.round(diff).toLocaleString("fr-FR")} €
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ height: 5, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${barW}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}80)`, borderRadius: 3, transition: "width 0.5s ease" }} />
                    </div>
                    <div style={{ fontSize: 10, color: "#64748b", marginTop: 3 }}>
                      {s.isEV ? "⚡" : s.isHybrid ? "🌿" : "⛽"} Entretien {m1} → {mN} €/an · Revente {resaleN.toLocaleString("fr-FR")} € ({Math.round(totKm / 1000)}k km)
                      {inclOppCost && opp > 0 && <span style={{ color: "#94a3b8" }}> · Opp. {opp.toLocaleString("fr-FR")} €</span>}
                    </div>
                  </div>
                </div>
              );
            })}

            {ranking.length >= 2 && (
              <div style={{ marginTop: 18, padding: 14, background: "#F7B73110", border: "1px solid #F7B73130", borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: "#F7B731", fontWeight: 700, fontFamily: "'Space Mono',monospace", marginBottom: 5 }}>💡 ANALYSE</div>
                <div style={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.6 }}>
                  <strong style={{ color: ranking[0].color }}>{ranking[0].name}</strong> est le plus économique sur {YEARS} ans à {kmYear.toLocaleString("fr-FR")} km/an.
                  {(() => {
                    const arkana = ranking.find(s => s.id === "arkana");
                    const ds3 = ranking.find(s => s.id === "ds3");
                    const r5_52 = ranking.find(s => s.id === "r5_52");
                    const parts = [];
                    if (arkana) {
                      const d = arkana.tco - ranking[0].tco;
                      if (d > 0) parts.push(<span key="a"> L'<strong style={{ color: arkana.color }}>Arkana hybride</strong> est à +{Math.round(d).toLocaleString("fr-FR")} € — pénalisée par l'essence ({(fuelP * Math.pow(1 + eInfl, YEARS - 1)).toFixed(2)} €/L en an {YEARS}) et un entretien plus lourd (boîte crabots).</span>);
                      else parts.push(<span key="a"> L'<strong style={{ color: arkana.color }}>Arkana hybride</strong> compense son coût carburant par un prix d'achat compétitif et zéro angoisse autonomie.</span>);
                    }
                    if (ds3) {
                      const d = ds3.tco - ranking[0].tco;
                      parts.push(<span key="d"> La <strong style={{ color: ds3.color }}>DS3 2020</strong> est la moins chère à l'achat (16 499 €) mais {d > 0 ? `à +${Math.round(d).toLocaleString("fr-FR")} € en TCO` : "compétitive"} — risque batterie dès 8 ans d'âge total, entretien DS plus cher.</span>);
                    }
                    if (r5_52) {
                      const d = r5_52.tco - ranking[0].tco;
                      if (d > 500) parts.push(<span key="r"> La <strong style={{ color: r5_52.color }}>R5 52 kWh</strong> neuve est à +{Math.round(d).toLocaleString("fr-FR")} € : l'écart d'achat est le prix du neuf, de la garantie et de la technologie moderne.</span>);
                    }
                    return parts;
                  })()}
                  {kmYear > 15000 && <span> À {kmYear.toLocaleString("fr-FR")} km/an, la faible conso des EV creuse l'écart face à l'hybride.</span>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 18, padding: "16px 20px", margin: "16px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
            <SliderControl label="Km / an" value={kmYear} onChange={setKmYear} min={5000} max={30000} step={1000} unit=" km" />
            <SliderControl label="Prix élec. (an 1)" value={elecP} onChange={setElecP} min={0.10} max={0.40} step={0.01} unit=" €/kWh" />
            <SliderControl label="Prix essence (an 1)" value={fuelP} onChange={setFuelP} min={1.40} max={2.20} step={0.02} unit=" €/L" />
            <SliderControl label="Inflation énergie" value={eInfl} onChange={setEInfl} min={0} max={0.10} step={0.005} unit="" format={v => `${(v * 100).toFixed(1)} %`} />
            <SliderControl label="Inflation générale" value={gInfl} onChange={setGInfl} min={0} max={0.06} step={0.005} unit="" format={v => `${(v * 100).toFixed(1)} %`} />
            {inclOppCost && (
              <SliderControl label="Taux opportunité" value={oppRate} onChange={setOppRate} min={0.01} max={0.06} step={0.005} unit="" format={v => `${(v * 100).toFixed(1)} %`} />
            )}
          </div>
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12, color: "#94a3b8" }}>
              <input type="checkbox" checked={inclSurbonus} onChange={e => setInclSurbonus(e.target.checked)} style={{ accentColor: "#F7B731", width: 14, height: 14 }} />
              Surbonus batterie UE
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12, color: "#94a3b8" }}>
              <input type="checkbox" checked={inclOppCost} onChange={e => setInclOppCost(e.target.checked)} style={{ accentColor: "#A55EEA", width: 14, height: 14 }} />
              Coût d'opportunité du capital
            </label>
          </div>
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 14, fontSize: 10, color: "#475569", fontFamily: "'Space Mono',monospace" }}>
            <span>📏 +{totalKm.toLocaleString("fr-FR")} km en {YEARS} ans</span>
            <span>⚡ Élec. an {YEARS} : {(elecP * Math.pow(1 + eInfl, YEARS - 1)).toFixed(2)} €</span>
            <span>⛽ Ess. an {YEARS} : {(fuelP * Math.pow(1 + eInfl, YEARS - 1)).toFixed(2)} €</span>
            {inclOppCost && cheapestS && mostExpS && (
              <span>📈 Écart capital max : {(getNetPurchase(mostExpS, inclSurbonus) - getNetPurchase(cheapestS, inclSurbonus)).toLocaleString("fr-FR")} €</span>
            )}
          </div>
          {highMileage && (
            <div style={{ marginTop: 8, padding: "6px 10px", background: "#FD964420", border: "1px solid #FD964460", borderRadius: 8, fontSize: 11, color: "#FD9644" }}>
              ⚠️ Kilométrage élevé ({totalKm.toLocaleString("fr-FR")} km ajoutés). Revente pénalisée (courbe convexe).
            </div>
          )}
        </div>

        {/* Methodology */}
        <div style={{ marginTop: 16, padding: 14, background: "#020617", borderRadius: 10, border: "1px solid #1e293b", fontSize: 10, color: "#475569", lineHeight: 1.8 }}>
          <strong style={{ color: "#64748b" }}>📋 Méthodologie v7</strong><br />
          • <strong>Horizon</strong> : {YEARS} ans, 7 scénarios — 2 R5 neufs (bonus + surbonus), 4 EV occasion, 1 hybride occasion.<br />
          • <strong>Occasions</strong> : annonces réelles février 2026. e-2008 Active Pack 17 499 €, ë-C4 Shine 2022 17 399 €, E-C4 2024 18 999 €, Arkana E-Tech 145 19 290 €, DS3 E-Tense 2020 16 499 €.<br />
          • <strong>Achat net</strong> : catalogue − bonus − surbonus. Reprise véhicule exclue (actif existant, pas une remise).<br />
          • <strong>Assurance amortie</strong> : −4%/an (dépréciation + bonus-malus France), plancher 65%, compensé par inflation générale.<br />
          • <strong>Risque batterie EV</strong> : −15% revente quand âge total véhicule ≥ 8 ans OU km total ≥ 160k (garantie expirée). Pour la DS3 2020 (6 ans à l'achat), le haircut s'applique dès l'an 2 de possession.<br />
          • <strong>Dépréciation convexe</strong> : pénalité = maxPenalty × (1 − e<sup>−decay×excessKm</sup>). Decay rates calibrés par type. Occasions : courbe plus plate (grosse dépréciation déjà absorbée).<br />
          • <strong>Conso réelle</strong> : EV 15-17,5 kWh/100 (÷ 0.88 rendement charge AC). Arkana hybride 5,5 L/100 (essais Largus, Caradisiac). DS3 gen1 17,5 kWh (plus lourde, moins efficace).<br />
          • <strong>Coût d'opportunité</strong> : composé sur capital immobilisé (défaut 3%). Toggle optionnel.<br />
          • <strong>Double inflation</strong> : énergie 5% + générale 2.5%.<br />
          • <strong>Sources</strong> : Autosphere, LeBonCoin, LaCentrale, Largus, Caradisiac, ChargeGuru, BNEF — février 2026.
        </div>
      </div>
    </div>
  );
}

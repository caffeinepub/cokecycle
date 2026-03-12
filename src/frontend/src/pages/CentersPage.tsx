import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  MapPin,
  Navigation,
  Package,
  Search,
  Store,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const CENTERS = [
  {
    id: 1,
    name: "GreenDrop Smart Bin – Central Park",
    type: "Smart Bin",
    address: "Central Park East, New York, NY 10024",
    hours: "24/7",
    distance: "0.3 km",
    status: "Active",
  },
  {
    id: 2,
    name: "EcoStore – Times Square",
    type: "Partner Store",
    address: "1560 Broadway, New York, NY 10036",
    hours: "8AM – 10PM",
    distance: "0.8 km",
    status: "Active",
  },
  {
    id: 3,
    name: "GreenHaven Scrap Center",
    type: "Scrap Center",
    address: "450 W 33rd St, New York, NY 10001",
    hours: "Mon–Sat 9AM–6PM",
    distance: "1.2 km",
    status: "Active",
  },
  {
    id: 4,
    name: "RecycleHub – Brooklyn",
    type: "Smart Bin",
    address: "200 Flatbush Ave, Brooklyn, NY 11217",
    hours: "24/7",
    distance: "2.1 km",
    status: "Active",
  },
  {
    id: 5,
    name: "EcoMart – Queens",
    type: "Partner Store",
    address: "90-15 Queens Blvd, Queens, NY 11373",
    hours: "9AM – 9PM",
    distance: "3.4 km",
    status: "Active",
  },
  {
    id: 6,
    name: "CleanCity Scrap",
    type: "Scrap Center",
    address: "1250 Waters Place, Bronx, NY 10461",
    hours: "Mon–Fri 8AM–5PM",
    distance: "4.7 km",
    status: "Active",
  },
  {
    id: 7,
    name: "GreenDrop – Harlem",
    type: "Smart Bin",
    address: "2280 Adam C Powell Jr Blvd, NY 10030",
    hours: "24/7",
    distance: "1.9 km",
    status: "Coming Soon",
  },
  {
    id: 8,
    name: "SustainMart – Midtown",
    type: "Partner Store",
    address: "630 Lexington Ave, New York, NY 10022",
    hours: "7AM – 11PM",
    distance: "0.5 km",
    status: "Active",
  },
];

const TYPE_ICONS: Record<string, any> = {
  "Smart Bin": Trash2,
  "Partner Store": Store,
  "Scrap Center": Package,
};

const TYPE_COLORS: Record<string, string> = {
  "Smart Bin": "text-primary border-primary/30 bg-primary/10",
  "Partner Store": "text-blue-400 border-blue-400/30 bg-blue-400/10",
  "Scrap Center": "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
};

export function CentersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = CENTERS.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || c.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-primary mb-4">
          <MapPin className="w-3.5 h-3.5" />
          Find Centers
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
          Collection <span className="text-gradient-green">Centers</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Find smart recycling bins, partner stores, and scrap collection
          centers near you.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            icon: Trash2,
            label: "Smart Bins",
            count: CENTERS.filter((c) => c.type === "Smart Bin").length,
            color: "text-primary",
          },
          {
            icon: Store,
            label: "Partner Stores",
            count: CENTERS.filter((c) => c.type === "Partner Store").length,
            color: "text-blue-400",
          },
          {
            icon: Package,
            label: "Scrap Centers",
            count: CENTERS.filter((c) => c.type === "Scrap Center").length,
            color: "text-yellow-400",
          },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-4 text-center">
            <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
            <div className={`font-display text-2xl font-bold ${s.color}`}>
              {s.count}
            </div>
            <div className="text-muted-foreground text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted border-border"
            data-ocid="centers.search_input"
          />
        </div>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="glass border-border h-10">
            {["All", "Smart Bin", "Partner Store", "Scrap Center"].map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className="text-xs"
                data-ocid="centers.tab"
              >
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Grid */}
      {!filtered.length ? (
        <div className="text-center py-20" data-ocid="centers.empty_state">
          <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No centers match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((center, i) => {
            const Icon = TYPE_ICONS[center.type] || MapPin;
            return (
              <div
                key={center.id}
                className="glass glass-hover rounded-2xl p-5"
                data-ocid={`centers.item.${i + 1}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${TYPE_COLORS[center.type]}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge
                      variant="outline"
                      className={`text-xs ${TYPE_COLORS[center.type]}`}
                    >
                      {center.type}
                    </Badge>
                    {center.status === "Coming Soon" && (
                      <Badge
                        variant="outline"
                        className="text-xs text-muted-foreground border-muted"
                      >
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                </div>
                <h3 className="font-display font-bold text-base mb-2 leading-snug">
                  {center.name}
                </h3>
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{center.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>{center.hours}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{center.distance} away</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-border text-muted-foreground hover:text-foreground"
                  disabled={center.status === "Coming Soon"}
                  onClick={() =>
                    window.open(
                      `https://maps.google.com?q=${encodeURIComponent(center.address)}`,
                      "_blank",
                    )
                  }
                  data-ocid={`centers.item.button.${i + 1}`}
                >
                  <Navigation className="w-3.5 h-3.5 mr-2" />
                  Get Directions
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";

const SIZE_OPTIONS = ["S", "M", "L", "XL"];
const CARD_QUANTITY_OPTIONS = ["1", "2", "3", "4", "5"];

type ProductType = "tee" | "bottle" | "tote" | "cards";

type Product = {
  id: string;
  name: string;
  type: ProductType;
  colour?: string;
  description: string;
  price: string;
  images: string[];
};

const PRODUCTS: Product[] = [
  {
    id: "black-tee-1",
    name: "LIVESOBERAF TEE",
    type: "tee",
    colour: "BLACK",
    description: "Premium black tee with LIVESOBERAF design.",
    price: "£30.00",
    images: [
      "/merch/IMG_0140.jpeg",
      "/merch/IMG_0167.jpeg",
      "/merch/IMG_0168.jpeg",
      "/merch/IMG_0179.jpeg",
    ],
  },
  {
    id: "black-tee-2",
    name: "LIVESOBERAF T-SHIRT 02",
    type: "tee",
    colour: "BLACK",
    description: "Premium black tee with alternate LIVESOBERAF design.",
    price: "£TBC",
    images: [],
  },
  {
    id: "white-tee-1",
    name: "LIVESOBERAF T-SHIRT 03",
    type: "tee",
    colour: "WHITE",
    description: "Premium white tee with LIVESOBERAF design.",
    price: "£TBC",
    images: [],
  },
  {
    id: "white-tee-2",
    name: "LIVESOBERAF T-SHIRT 04",
    type: "tee",
    colour: "WHITE",
    description: "Premium white tee with alternate LIVESOBERAF design.",
    price: "£TBC",
    images: [],
  },
  {
    id: "white-bottle",
    name: "LIVESOBERAF WATER BOTTLE",
    type: "bottle",
    colour: "WHITE",
    description: "Minimal bottle for everyday carry.",
    price: "£25.00",
    images: [
      "/merch/IMG_4351.jpeg",
      "/merch/IMG_4351-1.jpeg",
      "/merch/IMG_4290.jpeg",
    ],
  },
  {
    id: "black-bottle",
    name: "LIVESOBERAF WATER BOTTLE 02",
    type: "bottle",
    colour: "BLACK",
    description: "Minimal black bottle for everyday carry.",
    price: "£25.00",
    images: [],
  },
  {
    id: "tote-bag",
    name: "LIVESOBERAF TOTE BAG",
    type: "tote",
    colour: "WHITE",
    description: "Simple tote bag with LIVESOBERAF branding.",
    price: "£15.00",
    images: [
      "/merch/IMG_0195.jpeg",
      "/merch/IMG_0196.jpeg",
      "/merch/IMG_0197.jpeg",
    ],
  },
  {
    id: "card-1-year",
    name: "1 YEAR LIVESOBERAF CARD",
    type: "cards",
    colour: "WHITE",
    description: "Milestone card celebrating one year LIVESOBERAF.",
    price: "£TBC",
    images: [],
  },
];

export default function MerchPage() {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    "black-tee-1": "M",
    "black-tee-2": "M",
    "white-tee-1": "M",
    "white-tee-2": "M",
  });

  const [selectedCardQuantities, setSelectedCardQuantities] = useState<
    Record<string, string>
  >({ "card-1-year": "1" });

  const getCheckoutUrl = (
    productId: string,
    type: ProductType,
    selectedSize?: string,
    selectedQuantity?: string
  ) => {
    const stripeLinks: Record<string, string> = {
      // Add Stripe payment links here when ready:
      // "black-tee-1-S": "https://buy.stripe.com/...",
    };

    if (type === "tee" && selectedSize) {
      return stripeLinks[`${productId}-${selectedSize}`] || "";
    }
    if (type === "cards" && selectedQuantity) {
      return stripeLinks[`${productId}-${selectedQuantity}`] || "";
    }
    return stripeLinks[productId] || "";
  };

  const groupedProducts = useMemo(() => ({
    tees: PRODUCTS.filter((p) => p.type === "tee"),
    bottles: PRODUCTS.filter((p) => p.type === "bottle"),
    tote: PRODUCTS.filter((p) => p.type === "tote"),
    cards: PRODUCTS.filter((p) => p.type === "cards"),
  }), []);

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto max-w-7xl">
        <a
          href="/home"
          className="mb-10 inline-block text-sm uppercase tracking-[0.3em] text-white/50 transition hover:text-white"
        >
          BACK
        </a>

        <div className="mb-16">
          <p className="text-sm uppercase tracking-[0.35em] text-[#d28b95]">
            MERCHANDISE
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[0.2em] md:text-7xl">
            LIVESOBERAF STORE
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/60">
            A first collection. Clean, considered, and built to last.
          </p>
        </div>

        <div className="space-y-20">
          <ProductSection title="T-SHIRTS">
            {groupedProducts.tees.map((product) => {
              const selectedSize = selectedSizes[product.id] || "M";
              const checkoutUrl = getCheckoutUrl(product.id, product.type, selectedSize);

              return (
                <ProductCard key={product.id} product={product}>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.25em] text-white/40">
                      SIZE
                    </label>
                    <select
                      value={selectedSize}
                      onChange={(e) =>
                        setSelectedSizes((prev) => ({ ...prev, [product.id]: e.target.value }))
                      }
                      className="mt-3 w-full border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none"
                    >
                      {SIZE_OPTIONS.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <BuyButton checkoutUrl={checkoutUrl} price={product.price} />
                </ProductCard>
              );
            })}
          </ProductSection>

          <ProductSection title="WATER BOTTLES">
            {groupedProducts.bottles.map((product) => {
              const checkoutUrl = getCheckoutUrl(product.id, product.type);
              return (
                <ProductCard key={product.id} product={product}>
                  <BuyButton checkoutUrl={checkoutUrl} price={product.price} />
                </ProductCard>
              );
            })}
          </ProductSection>

          <ProductSection title="TOTE BAG">
            {groupedProducts.tote.map((product) => {
              const checkoutUrl = getCheckoutUrl(product.id, product.type);
              return (
                <ProductCard key={product.id} product={product}>
                  <BuyButton checkoutUrl={checkoutUrl} price={product.price} />
                </ProductCard>
              );
            })}
          </ProductSection>

          <ProductSection title="MILESTONE CARDS">
            {groupedProducts.cards.map((product) => {
              const selectedQuantity = selectedCardQuantities[product.id] || "1";
              const checkoutUrl = getCheckoutUrl(product.id, product.type, undefined, selectedQuantity);
              return (
                <ProductCard key={product.id} product={product}>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.25em] text-white/40">
                      QUANTITY
                    </label>
                    <select
                      value={selectedQuantity}
                      onChange={(e) =>
                        setSelectedCardQuantities((prev) => ({ ...prev, [product.id]: e.target.value }))
                      }
                      className="mt-3 w-full border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none"
                    >
                      {CARD_QUANTITY_OPTIONS.map((qty) => (
                        <option key={qty} value={qty}>{qty}</option>
                      ))}
                    </select>
                  </div>
                  <BuyButton checkoutUrl={checkoutUrl} price={product.price} />
                </ProductCard>
              );
            })}
          </ProductSection>
        </div>
      </section>
    </main>
  );
}

function ProductSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-8 flex items-center gap-4">
        <h2 className="text-xs uppercase tracking-[0.3em] text-white/40">{title}</h2>
        <div className="h-px flex-1 bg-white/10" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{children}</div>
    </section>
  );
}

function ProductCard({ product, children }: { product: Product; children: React.ReactNode }) {
  const [imageIndex, setImageIndex] = useState(0);
  const hasImages = product.images.length > 0;

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">

      {/* Image area */}
      <div className="relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden bg-neutral-900">
        {hasImages ? (
          <img
            src={product.images[imageIndex]}
            alt={product.name}
            className="h-full w-full object-contain sm:object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-xs uppercase tracking-[0.3em] text-white/30">
              Coming Soon
            </p>
          </div>
        )}
      </div>

      {/* Image navigation */}
      {hasImages && product.images.length > 1 && (
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <button
            onClick={() => setImageIndex((i) => (i - 1 + product.images.length) % product.images.length)}
            className="px-2 py-1 text-white/50 hover:text-white transition"
          >
            ←
          </button>
          <span className="text-xs text-white/30">
            {imageIndex + 1} / {product.images.length}
          </span>
          <button
            onClick={() => setImageIndex((i) => (i + 1) % product.images.length)}
            className="px-2 py-1 text-white/50 hover:text-white transition"
          >
            →
          </button>
        </div>
      )}

      {/* Product info */}
      <div className="space-y-5 p-6">
        <div>
          <h3 className="text-xl font-semibold leading-tight">{product.name}</h3>
          <p className="mt-2 text-white/60">{product.description}</p>
        </div>

        {children}
      </div>
    </div>
  );
}

function BuyButton({ checkoutUrl, price }: { checkoutUrl: string; price: string }) {
  if (!checkoutUrl) {
    return (
      <div className="flex items-center justify-between border border-white/10 px-6 py-4">
        <span className="text-sm uppercase tracking-[0.2em] text-white/60">{price}</span>
        <span className="text-xs uppercase tracking-[0.25em] text-white/30">Coming Soon</span>
      </div>
    );
  }

  return (
    <a
      href={checkoutUrl}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between border border-white/20 px-6 py-4 transition hover:bg-white hover:text-black"
    >
      <span className="text-sm uppercase tracking-[0.2em]">{price}</span>
      <span className="text-xs uppercase tracking-[0.25em]">Buy Now</span>
    </a>
  );
}

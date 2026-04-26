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
  priceLabel: string;
};

const PRODUCTS: Product[] = [
  {
    id: "black-tee-1",
    name: "LIVESOBERAF T-SHIRT 01",
    type: "tee",
    colour: "BLACK",
    description: "Premium black tee with LIVESOBERAF design.",
    priceLabel: "£TBC",
  },
  {
    id: "black-tee-2",
    name: "LIVESOBERAF T-SHIRT 02",
    type: "tee",
    colour: "BLACK",
    description: "Premium black tee with alternate LIVESOBERAF design.",
    priceLabel: "£TBC",
  },
  {
    id: "white-tee-1",
    name: "LIVESOBERAF T-SHIRT 03",
    type: "tee",
    colour: "WHITE",
    description: "Premium white tee with LIVESOBERAF design.",
    priceLabel: "£TBC",
  },
  {
    id: "white-tee-2",
    name: "LIVESOBERAF T-SHIRT 04",
    type: "tee",
    colour: "WHITE",
    description: "Premium white tee with alternate LIVESOBERAF design.",
    priceLabel: "£TBC",
  },
  {
    id: "white-bottle",
    name: "LIVESOBERAF WATER BOTTLE 01",
    type: "bottle",
    colour: "WHITE",
    description: "Minimal white bottle for everyday carry.",
    priceLabel: "£TBC",
  },
  {
    id: "black-bottle",
    name: "LIVESOBERAF WATER BOTTLE 02",
    type: "bottle",
    colour: "BLACK",
    description: "Minimal black bottle for everyday carry.",
    priceLabel: "£TBC",
  },
  {
    id: "tote-bag",
    name: "LIVESOBERAF TOTE BAG",
    type: "tote",
    colour: "NATURAL",
    description: "Simple tote bag with LIVESOBERAF branding.",
    priceLabel: "£TBC",
  },
  {
    id: "card-1-year",
    name: "1 YEAR LIVESOBERAF CARD",
    type: "cards",
    colour: "WHITE",
    description: "Milestone card celebrating one year LIVESOBERAF.",
    priceLabel: "£TBC",
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
  >({
    "card-1-year": "1",
  });

  const getCheckoutUrl = (
    productId: string,
    type: ProductType,
    selectedSize?: string,
    selectedQuantity?: string
  ) => {
    // REPLACE THESE WITH YOUR REAL STRIPE PAYMENT LINKS LATER
    const stripeLinks: Record<string, string> = {
      // Examples:
      // "black-tee-1-S": "https://buy.stripe.com/...",
      // "black-tee-1-M": "https://buy.stripe.com/...",
      // "card-1-year-1": "https://buy.stripe.com/...",
      // "card-1-year-2": "https://buy.stripe.com/...",
      // "white-bottle": "https://buy.stripe.com/...",
    };

    if (type === "tee" && selectedSize) {
      return stripeLinks[`${productId}-${selectedSize}`] || "";
    }

    if (type === "cards" && selectedQuantity) {
      return stripeLinks[`${productId}-${selectedQuantity}`] || "";
    }

    return stripeLinks[productId] || "";
  };

  const groupedProducts = useMemo(() => {
    return {
      tees: PRODUCTS.filter((p) => p.type === "tee"),
      bottles: PRODUCTS.filter((p) => p.type === "bottle"),
      tote: PRODUCTS.filter((p) => p.type === "tote"),
      cards: PRODUCTS.filter((p) => p.type === "cards"),
    };
  }, []);

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto max-w-7xl">
        <a
          href="/home"
          className="mb-10 inline-block text-sm uppercase tracking-[0.3em] text-white/50 transition hover:text-white"
        >
          BACK
        </a>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">
              MERCHANDISE
            </p>

            <h1 className="mt-4 text-5xl font-semibold tracking-[0.2em] md:text-7xl">
              LIVESOBERAF STORE
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
              A small first collection. Clean, simple, and designed to feel
              considered. Product photography can be dropped in tomorrow
              without changing the store structure.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 text-sm uppercase tracking-[0.2em] text-white/60">
            HIGH-END FIRST RELEASE
          </div>
        </div>

        <div className="mt-16 space-y-16">
          <ProductSection title="T-SHIRTS">
            {groupedProducts.tees.map((product) => {
              const selectedSize = selectedSizes[product.id] || "M";
              const checkoutUrl = getCheckoutUrl(
                product.id,
                product.type,
                selectedSize
              );

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  imageTone={product.colour === "WHITE" ? "light" : "dark"}
                >
                  <div>
                    <label className="block text-xs uppercase tracking-[0.25em] text-white/40">
                      SIZE
                    </label>
                    <select
                      value={selectedSize}
                      onChange={(e) =>
                        setSelectedSizes((prev) => ({
                          ...prev,
                          [product.id]: e.target.value,
                        }))
                      }
                      className="mt-3 w-full border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none"
                    >
                      {SIZE_OPTIONS.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  <BuyButton checkoutUrl={checkoutUrl} />
                </ProductCard>
              );
            })}
          </ProductSection>

          <ProductSection title="WATER BOTTLES">
            {groupedProducts.bottles.map((product) => {
              const checkoutUrl = getCheckoutUrl(product.id, product.type);

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  imageTone={product.colour === "WHITE" ? "light" : "dark"}
                >
                  <BuyButton checkoutUrl={checkoutUrl} />
                </ProductCard>
              );
            })}
          </ProductSection>

          <ProductSection title="TOTE BAG">
            {groupedProducts.tote.map((product) => {
              const checkoutUrl = getCheckoutUrl(product.id, product.type);

              return (
                <ProductCard key={product.id} product={product} imageTone="mid">
                  <BuyButton checkoutUrl={checkoutUrl} />
                </ProductCard>
              );
            })}
          </ProductSection>

          <ProductSection title="MILESTONE CARDS">
            {groupedProducts.cards.map((product) => {
              const selectedQuantity =
                selectedCardQuantities[product.id] || "1";
              const checkoutUrl = getCheckoutUrl(
                product.id,
                product.type,
                undefined,
                selectedQuantity
              );

              return (
                <ProductCard key={product.id} product={product} imageTone="light">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.25em] text-white/40">
                      QUANTITY
                    </label>
                    <select
                      value={selectedQuantity}
                      onChange={(e) =>
                        setSelectedCardQuantities((prev) => ({
                          ...prev,
                          [product.id]: e.target.value,
                        }))
                      }
                      className="mt-3 w-full border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none"
                    >
                      {CARD_QUANTITY_OPTIONS.map((qty) => (
                        <option key={qty} value={qty}>
                          {qty}
                        </option>
                      ))}
                    </select>
                  </div>

                  <BuyButton checkoutUrl={checkoutUrl} />
                </ProductCard>
              );
            })}
          </ProductSection>
        </div>
      </section>
    </main>
  );
}

function ProductSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-[0.15em]">{title}</h2>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </section>
  );
}

function ProductCard({
  product,
  imageTone,
  children,
}: {
  product: Product;
  imageTone: "dark" | "light" | "mid";
  children: React.ReactNode;
}) {
  const imageClasses =
    imageTone === "light"
      ? "bg-white text-black"
      : imageTone === "mid"
      ? "bg-neutral-200 text-black"
      : "bg-neutral-900 text-white";

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
      <div
        className={`aspect-[4/5] w-full ${imageClasses} flex items-center justify-center text-center text-sm uppercase tracking-[0.35em]`}
      >
        PRODUCT IMAGE
      </div>

      <div className="space-y-6 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-white/40">
            {product.colour || "LIVESOBERAF"}
          </p>

          <h3 className="mt-3 text-2xl font-semibold leading-tight">
            {product.name}
          </h3>

          <p className="mt-4 text-white/70">{product.description}</p>

          <p className="mt-4 text-sm uppercase tracking-[0.25em] text-white/50">
            {product.priceLabel}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}

function BuyButton({ checkoutUrl }: { checkoutUrl: string }) {
  if (!checkoutUrl) {
    return (
      <button
        disabled
        className="w-full border border-white/10 px-6 py-4 text-sm uppercase tracking-[0.3em] text-white/30"
      >
        PAYMENT LINK TO ADD
      </button>
    );
  }

  return (
    <a
      href={checkoutUrl}
      target="_blank"
      rel="noreferrer"
      className="block w-full border border-white/20 px-6 py-4 text-center text-sm uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
    >
      BUY NOW
    </a>
  );
}
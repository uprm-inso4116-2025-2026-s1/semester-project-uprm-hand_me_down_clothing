import { Piece } from "@/app/types/piece";
import { PieceRepository } from "@/src/repositories/pieceRepository";
import Link from "next/link";

const dummyUserId = "00000000-0000-0000-0000-000000000000"; // TODO: replace with real user id

export default async function DashboardPage() {
  const repository = new PieceRepository();
  const pieces = await repository.getPieces();

  const uploadedPieces = pieces.filter((piece) => piece.user_id === dummyUserId);
  const purchasedPieces = pieces.filter(
    // @ts-ignore – adjust when your purchase model is ready
    (piece: any) => piece.buyer_id === dummyUserId
  );

  return (
    <main className="p-3 text-[#2b2b2b] dark:text-[#f5f5dc]">
      <h1 className="italic text-5xl sm:text-6xl font-bold mb-8 text-black">
        Your Dashboard
      </h1>

      <div className="mx-auto w-340 space-y-10">
        {/* Overview section */}
        <section className="rounded-3xl w-full bg-[#abc8c1] p-6 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
            <OverviewStat
              label="Pieces uploaded"
              value={uploadedPieces.length}
              note="Items you’re currently sharing with the community."
            />
            <OverviewStat
              label="Pieces bought"
              value={purchasedPieces.length}
              note="Pre-loved pieces you’ve given a second life."
            />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold italic text-black">
                Quick actions
              </h3>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <Link
                  href="/listings/sell_piece"
                  className="px-4 py-2 rounded-full bg-[#d7b1b1] hover:bg-[#cda0a0] text-white font-semibold italic transition-colors"
                >
                  Sell a new piece
                </Link>
                <Link
                  href="/browsing"
                  className="px-4 py-2 rounded-full bg-white/80 hover:bg-white text-[#2b2b2b] font-semibold italic border border-white/60 transition-colors"
                >
                  Browse listings
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Uploaded pieces */}
        <section className="bg-white border-2 border-[#E5E7EF] rounded-3xl p-6 sm:p-8">
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-3xl font-bold italic mb-1 text-black">
                Pieces you’ve uploaded
              </h2>
              <p className="text-[#666666] text-sm">
                Manage the items you’re selling or have shared.
              </p>
            </div>
            <span className="inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-semibold bg-[#abc8c1] text-white">
              {uploadedPieces.length} active
            </span>
          </header>

          {uploadedPieces.length === 0 ? (
            <EmptyState
              title="No pieces uploaded yet"
              description="Start by listing a piece you no longer wear and give it a second life."
              ctaLabel="Sell your first piece"
              href="/sell_piece"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 gap-x-4">
              {uploadedPieces.map((piece, index) => (
                <PieceCard key={index} piece={piece} badge="On sale" />
              ))}
            </div>
          )}
        </section>

        {/* Purchased pieces */}
        <section className="bg-white border-2 border-[#E5E7EF] rounded-3xl p-6 sm:p-8">
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-3xl font-bold italic mb-1 text-black">
                Pieces you’ve bought
              </h2>
              <p className="text-[#666666] text-sm">
                A history of the pre-loved items you’ve brought into your closet.
              </p>
            </div>
            <span className="inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-semibold bg-[#d7b1b1] text-white">
              {purchasedPieces.length} purchased
            </span>
          </header>

          {purchasedPieces.length === 0 ? (
            <EmptyState
              title="No purchases yet"
              description="Explore the marketplace and discover pieces that match your style."
              ctaLabel="Browse pieces"
              href="/listings"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 gap-x-4">
              {purchasedPieces.map((piece, index) => (
                <PieceCard key={index} piece={piece} badge="Purchased" />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function OverviewStat({
  label,
  value,
  note,
}: {
  label: string;
  value: number;
  note: string;
}) {
  return (
    <div className="space-y-1 max-w-xs">
      <h3 className="text-2xl font-bold italic text-black">{label}</h3>
      <p className="text-3xl sm:text-4xl font-extrabold text-white">{value}</p>
      <p className="text-xs text-white/85">{note}</p>
    </div>
  );
}

function EmptyState({
  title,
  description,
  ctaLabel,
  href,
}: {
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4 rounded-2xl bg-[#f3f3f3]">
      <h3 className="text-xl font-semibold mb-2 text-black">{title}</h3>
      <p className="text-sm text-[#666666] mb-4 max-w-sm">{description}</p>
      <Link
        href={href}
        className="px-5 py-2 rounded-full bg-[#d7b1b1] hover:bg-[#cda0a0] text-white font-semibold italic transition-colors"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

function PieceCard({ piece, badge }: { piece: Piece; badge: string }) {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Bloque superior verde */}
      <div className="h-64 w-full bg-[#abc8c1]" />

      {/* Parte inferior con info */}
      <div className="p-5 flex flex-col justify-between h-40">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h5 className="text-lg font-semibold text-black truncate">
            {piece.name}
          </h5>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              badge === "Purchased"
                ? "bg-[#d7b1b1]/30 text-[#cda0a0]"
                : "bg-[#abc8c1]/30 text-[#2b2b2b]"
            }`}
          >
            {badge}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-black">
            {piece.getFormattedPrice
              ? piece.getFormattedPrice()
              : `$${piece.price}`}
          </span>
        </div>
      </div>
    </div>
  );
}

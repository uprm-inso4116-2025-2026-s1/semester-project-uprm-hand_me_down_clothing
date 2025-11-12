"use client";
// you have to download in the terminal because it is a icon library:  npm i lucide-react
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function cx(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export default function TopNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // --- dynamic behavior: sticky + hide-on-scroll + shadow ---
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setScrolled(y > 8);
      if (prefersReducedMotion) {
        setHidden(false);
        lastY.current = y;
        return;
      }
      const goingDown = y > lastY.current;
      setHidden(goingDown && y > 80);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [prefersReducedMotion]);

  const links = [
    { href: "/listings/sell_piece", label: "Browse" },
    { href: "/map", label: "Map" },
    { href: "/listings/donate", label: "Donate" },
    { href: "/about", label: "About" },
    { href: "/Login", label: "Sign in/Sign Up" },
    { href: "/dashboard", label: "Dashboard" }, // 👈 nuevo
    { href: "/profile", label: "Profile" },
  ];



  const favActive = mounted && pathname.toLowerCase().startsWith("/favorite");

  return (
    <header
      className={cx(
        "w-full bg-white border-b border-[#eaeaea] sticky top-0 z-50",
        !prefersReducedMotion && "transition-transform duration-300",
        hidden ? "-translate-y-full" : "translate-y-0",
        scrolled ? "shadow-sm" : "shadow-none"
      )}
    >
      <div className="mx-auto max-w-7xl px-3 md:px-4">
        {/* Top row: logo | links | actions */}
        <div className="flex items-center justify-between gap-2 md:gap-4 py-2 md:py-3">

          <Link href="/" className="shrink-0 inline-flex items-center gap-2 overflow-visible">
            <Image
              src="/images/logo.png"
              alt="Hand Me Down Clothing"
              width={120}
              height={120}
              className="
                h-20 md:h-30 w-auto object-contain
                transform origin-left
                scale-[1.45] md:scale-[1.7]
                pointer-events-none
                translate-y-[1px]
              "
              priority
            />
            <span className="sr-only">Hand Me Down</span>
          </Link>

          {/* Center: Links (scrollable on small screens, centered on md+) */}
          <nav
            aria-label="Primary"
            className={cx(
              "flex-1 mx-2 md:mx-6",
              "overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            )}
          >
            <ul className="flex items-center justify-start md:justify-center gap-2 md:gap-4">
              {links.map(({ href, label }) => {
                const active =
                  mounted && (pathname === href || pathname.startsWith(href + "/"));
                return (
                  <li key={href} className="shrink-0">
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cx(
                        "inline-block rounded-xl px-3 py-2",
                        "text-sm md:text-base leading-5 text-[#6b6f73]",
                        "hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/40",
                        active && "font-semibold text-[#2b2f33] bg-gray-100"
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right: Actions */}
          <div className="shrink-0 flex items-center gap-2 md:gap-3">
            <Link
              href="/sell_piece"
              className={cx(
                "inline-flex items-center justify-center rounded-full",
                "px-4 md:px-5 py-1.5 md:py-2 text-sm md:text-base font-semibold",
                "text-white bg-[#cea2a2] shadow-sm transition",
                "hover:opacity-95 active:bg-[#c29090] active:shadow-inner active:translate-y-[1px] active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/40",
                "touch-manipulation"
              )}
            >
              Get Started
            </Link>

            {/* Heart -> Favorite (turns pink on press, stays pink on /favorite) */}
            <Link
              href="/Favorites"
              aria-label="Favorite"
              title="Favorite"
              aria-current={favActive ? "page" : undefined}
              className={cx(
                "group inline-flex h-12 w-12 md:h-12 md:w-12 items-center justify-center rounded-full",
                "hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/40",
                "touch-manipulation"
              )}
            >
              <Heart
                strokeWidth={2.25}
                className={cx(
                  "h-8 w-10 md:h-8 md:w-8 transition-colors",

                  !favActive && "text-black",

                  favActive && "text-[#cea2a2] fill-current",

                  "group-active:text-[#cea2a2] group-active:fill-current"
                )}
              />
            </Link>

            {/* Cart -> Listings */}
            <Link
              href="/listings"
              aria-label="Cart"
              title="Cart"
              className={cx(
                "inline-flex h-12 w-12 md:h-12 md:w-12 items-center justify-center rounded-full",
                "hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/40",
                "touch-manipulation"
              )}
            >
              <ShoppingBag strokeWidth={2.25} className="h-8 w-10 md:h-8 md:w-8 text-black" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "@/contexts/admin-context";

// SVG Icon Components
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.823-6.491a.75.75 0 00-.69-1.087H5.25" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

export function GlassNav() {
  const pathname = usePathname();
  const { shouldShowAdminElements, viewMode } = useAdmin();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by only rendering after client-side mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSearchModalOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isSearchModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isSearchModalOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchModalOpen(false);
    alert("Search feature is coming soon!");
  };

  const handleComingSoon = (feature: string) => {
    alert(`${feature} feature is coming soon!`);
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  // Hide GlassNav on specific routes
  const shouldHideGlassNav = pathname.includes("/teleprompter") || 
                             pathname.includes("/create-meeting") || 
                             pathname.includes("/create-community") || 
                             pathname.includes("/resume") ||
                             pathname.includes("/caricature") ||
                             pathname.includes("/odh") ||
                             pathname.includes("/hypno") ||
                             (pathname.startsWith("/communities/") && pathname !== "/communities");

  return (
    <>
      {/* Only render after client-side hydration to prevent flash */}
      {isClient && shouldShowAdminElements && viewMode === "admin" && !shouldHideGlassNav && (
        <>
          {/* Bottom Navigation Bar */}
          <nav className="pro-glass-nav">
        <ul className="pro-glass-nav-list">
          {/* Home */}
          <li className={`pro-glass-nav-item ${isActive("/") ? "active" : ""}`}>
            <Link href="/" className="pro-glass-nav-link">
              <HomeIcon className="pro-glass-nav-icon" />
            </Link>
          </li>

          {/* Search */}
          <li
            className={`pro-glass-nav-item ${isSearchModalOpen ? "active" : ""}`}
          >
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="pro-glass-nav-link"
              aria-label="Open search"
            >
              <SearchIcon className="pro-glass-nav-icon" />
            </button>
          </li>

          {/* Shop/Plus */}
          <li className={`pro-glass-nav-item ${isActive("/shop") ? "active" : ""}`}>
            <Link href="/shop" className="pro-glass-nav-link">
              <PlusIcon className="pro-glass-nav-icon" />
            </Link>
          </li>

          {/* Cart */}
          <li className="pro-glass-nav-item">
            <button
              onClick={() => handleComingSoon("Cart")}
              className="pro-glass-nav-link"
              aria-label="Cart (coming soon)"
            >
              <CartIcon className="pro-glass-nav-icon" />
              <span className="pro-glass-nav-cart-count">0</span>
            </button>
          </li>

          {/* Account */}
          <li className="pro-glass-nav-item">
            <button
              onClick={() => handleComingSoon("Account")}
              className="pro-glass-nav-link"
              aria-label="Account (coming soon)"
            >
              <UserIcon className="pro-glass-nav-icon" />
            </button>
          </li>
        </ul>
      </nav>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <div
          className={`pro-glass-search-modal ${isSearchModalOpen ? "modal-visible" : ""}`}
          onClick={() => setIsSearchModalOpen(false)}
        >
          <div
            className="pro-glass-search-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsSearchModalOpen(false)}
              className="pro-glass-search-modal-close"
              aria-label="Close search"
            >
              &times;
            </button>
            <h3>Search Products</h3>
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                type="search"
                className="search-field"
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="search-submit">
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx global>{`
        /* --- Tab Bar Styles --- */
        .pro-glass-nav {
          --nav-height: 75px;
          --nav-padding: 12px;
          --icon-size: 26px;
          --icon-color: #a9a9b0;
          --icon-color-active: #06b6d4;
          --blur-amount: 24px;
          --background-color: rgba(0, 0, 0, 0.6);
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 40px);
          max-width: 400px;
          z-index: 1000;
          background: var(--background-color);
          backdrop-filter: blur(var(--blur-amount)) saturate(180%) brightness(120%);
          -webkit-backdrop-filter: blur(var(--blur-amount)) saturate(180%) brightness(120%);
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.08) inset,
            0 2px 8px rgba(0, 0, 0, 0.3);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }
        .pro-glass-nav-list {
          list-style: none;
          margin: 0;
          padding: var(--nav-padding);
          display: flex;
          justify-content: space-around;
          position: relative;
        }
        .pro-glass-nav-item {
          flex: 1;
        }
        .pro-glass-nav-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--icon-color);
          text-decoration: none;
          height: 40px;
          position: relative;
          z-index: 1;
          transition: color 0.4s ease;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
        }
        .pro-glass-nav-icon {
          width: var(--icon-size);
          height: var(--icon-size);
          transition: transform 0.3s ease, color 0.3s ease;
          stroke-width: 1.5;
        }
        .pro-glass-nav-item.active .pro-glass-nav-link {
          color: var(--icon-color-active);
        }
        .pro-glass-nav-item.active .pro-glass-nav-icon {
          transform: translateY(-2px) scale(1.1);
        }
        .pro-glass-nav-cart-count {
          position: absolute;
          top: -5px;
          right: 20px;
          background-color: var(--icon-color-active);
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 11px;
          font-weight: 600;
          display: none;
          align-items: center;
          justify-content: center;
          line-height: 1;
          z-index: 10;
        }
        .pro-glass-nav-cart-count:not(:empty) {
          display: flex !important;
        }

        /* --- Search Modal Styles --- */
        .pro-glass-search-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .pro-glass-search-modal.modal-visible {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }
        .pro-glass-search-modal-content {
          position: relative;
          width: calc(100% - 40px);
          max-width: 400px;
          padding: 25px;
          background: rgba(30, 30, 32, 0.85);
          backdrop-filter: blur(var(--blur-amount));
          -webkit-backdrop-filter: blur(var(--blur-amount));
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          color: #fff;
          transform: scale(0.95);
          transition: transform 0.3s ease;
          margin: 0 20px;
          text-align: center;
        }
        .pro-glass-search-modal.modal-visible .pro-glass-search-modal-content {
          transform: scale(1);
        }
        .pro-glass-search-modal-close {
          position: absolute;
          top: 10px;
          right: 15px;
          background: none;
          border: none;
          color: #fff;
          font-size: 28px;
          cursor: pointer;
          line-height: 1;
          transition: opacity 0.3s ease;
        }
        .pro-glass-search-modal-close:hover {
          opacity: 0.7;
        }
        .pro-glass-search-modal h3 {
          margin: 0 0 15px 0;
          font-size: 18px;
          font-weight: 600;
        }
        .pro-glass-search-modal .search-form {
          display: flex;
          margin-top: 15px;
          justify-content: center;
          align-items: stretch;
        }
        .pro-glass-search-modal .search-field {
          flex-grow: 1;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(0, 0, 0, 0.2);
          border-radius: 14px 0 0 14px;
          color: #fff;
          height: 48px;
          box-sizing: border-box;
          font-size: 14px;
          line-height: 1.4;
          outline: none;
        }
        .pro-glass-search-modal .search-field::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        .pro-glass-search-modal .search-field:focus {
          border-color: rgba(6, 182, 212, 0.5);
        }
        .pro-glass-search-modal .search-submit {
          padding: 12px 18px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: var(--icon-color-active);
          color: white;
          border-radius: 0 14px 14px 0;
          cursor: pointer;
          transition: background-color 0.3s ease;
          height: 48px;
          box-sizing: border-box;
          font-size: 14px;
          line-height: 1.4;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pro-glass-search-modal .search-submit:hover {
          background: #0891b2;
        }

        /* Responsive adjustments */
        @media (min-width: 768px) {
          .pro-glass-nav {
            bottom: 30px;
          }
        }

        /* Hide on larger screens if desired */
        @media (min-width: 1024px) {
          .pro-glass-nav {
            display: none;
          }
        }
      `}</style>
        </>
      )}
    </>
  );
}

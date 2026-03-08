import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-3">
              Carib<span className="text-gold">Compare</span>
            </h3>
            <p className="text-sm text-gray-300">
              Independent comparison service for Caribbean residents. We may
              earn a commission from partners at no cost to you.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gold">
              Compare
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/send-money" className="hover:text-white transition-colors">
                  Send Money
                </Link>
              </li>
              <li>
                <Link href="/invest" className="hover:text-white transition-colors">
                  Invest
                </Link>
              </li>
              <li>
                <Link href="/crypto" className="hover:text-white transition-colors">
                  Crypto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gold">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/guides" className="hover:text-white transition-colors">
                  Guides
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-navy-light mt-8 pt-8 text-center text-xs text-gray-400">
          &copy; 2026 CaribCompare. Independent comparison service.
        </div>
      </div>
    </footer>
  );
}

import { FaWhatsapp, FaTiktok, FaXTwitter, FaThreads, FaFacebook, FaInstagram } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const COLUMNS = [
  {
    title: 'Nabus Motors',
    links: [
      { label: 'Inventory', to: '/explore' },
      { label: 'About Us', to: '/about' },
      { label: 'Finance', to: '/contact' },
      { label: 'Trade-In', to: '/contact' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'Contact Us', to: '/contact' },
      { label: 'Book a Test Drive', to: '/contact' },
      { label: 'Find Us', to: '/contact' },
      { label: 'Servicing', to: '/contact' },
    ],
  },
];

const SOCIALS = [
  {
    Icon: FaWhatsapp,
    label: 'WhatsApp',
    href: 'https://wa.me/233279940200'
  },
  {
    Icon: FaFacebook,
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1MWWDS7Ytk/'
  },
  {
    Icon: FaInstagram,
    label: 'Instagram',
    href: 'https://www.instagram.com/nabusmotors?igsh=NXF0djdqejVxNG4='
  },
  {
    Icon: FaTiktok,
    label: 'TikTok',
    href: 'https://www.tiktok.com/@nabusmotors'
  },
  {
    Icon: FaXTwitter,
    label: 'X',
    href: 'https://x.com/nabusmotors1'
  },
  {
    Icon: FaThreads,
    label: 'Threads',
    href: 'https://www.threads.com/@nabusmotors'
  },
];

export function Footer() {
  return (
      <footer className="w-full bg-ink text-onDark">
        <div className="shell py-16 md:py-20">
          <p className="max-w-4xl text-[13px] leading-[1.8] text-onDark/70">
            Nabus Motors is your trusted partner in finding the perfect vehicle. Quality cars, exceptional service.
          </p>

          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {COLUMNS.map((column) => (
                <div key={column.title}>
                  <h3 className="eyebrow text-white">{column.title}</h3>
                  <ul className="mt-5 space-y-3">
                    {column.links.map((link) => (
                        <li key={link.label}>
                          <Link
                              to={link.to}
                              className="text-sm text-onDark transition-colors hover:text-white"
                          >
                            {link.label}
                          </Link>
                        </li>
                    ))}
                  </ul>
                </div>
            ))}

            <div>
              <h3 className="eyebrow text-white">Visit</h3>
              <ul className="mt-5 space-y-3 text-sm">
                <li>Olusegun Obasanjo Wy, Accra</li>
                <li>
                  <a href="tel:0279940200" className="transition-colors hover:text-white">
                    0279 940 200
                  </a>
                </li>
                <li>
                  <a
                      href="mailto:nabusmotors1@gmail.com"
                      className="transition-colors hover:text-white"
                  >
                    nabusmotors1@gmail.com
                  </a>
                </li>
                <li className="pt-2 text-onDark/60">Mon–Fri 9:00–18:00</li>
                <li className="text-onDark/60">Sat 9:00–16:00</li>
              </ul>
            </div>

            <div>
              <h3 className="eyebrow text-white">Follow Us</h3>
              <div className="mt-5 flex flex-wrap gap-3">
                {SOCIALS.map(({ Icon, label, href }) => (
                    <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex h-10 w-10 items-center justify-center border border-white/15 transition-colors hover:border-[var(--accent-solid)] hover:text-[var(--accent-solid)]"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-onDark/60">
              © {new Date().getFullYear()} Nabus Motors. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
  );
}
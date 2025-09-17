import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0D1115] text-white mt-16">
      <div className="mx-auto max-w-6xl px-[120px] py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F54858901b0c442e6a38e6cc906052164%2F462b12e4225140b88803a67447d747f3?format=webp&width=800"
              alt="Foody"
              className="w-9 h-9"
            />
            <div className="text-2xl font-extrabold">Foody</div>
          </div>
          <p className="text-sm text-gray-300 mt-3">
            Enjoy homemade flavors & chef’s signature dishes, freshly prepared
            every day. Order online or visit our nearest branch.
          </p>
          <div className="mt-6 text-sm font-semibold text-gray-200">
            Follow on Social Media
          </div>
          <div className="flex gap-3 mt-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="h-10 w-10 rounded-full border border-gray-700 grid place-items-center"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F54858901b0c442e6a38e6cc906052164%2F12026922be734696948da66d9b86e840?format=webp&width=200"
                alt="facebook"
                className="w-5 h-5"
              />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="h-10 w-10 rounded-full border border-gray-700 grid place-items-center"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F54858901b0c442e6a38e6cc906052164%2Fd4a5f48743594c818038d7d51e1f6877?format=webp&width=200"
                alt="instagram"
                className="w-5 h-5"
              />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="h-10 w-10 rounded-full border border-gray-700 grid place-items-center"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F54858901b0c442e6a38e6cc906052164%2F9d251aae2446439e9ff1b3b5e158d2cb?format=webp&width=200"
                alt="linkedin"
                className="w-5 h-5"
              />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="h-10 w-10 rounded-full border border-gray-700 grid place-items-center"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F54858901b0c442e6a38e6cc906052164%2F7cea849898e0474fa51d2a2c751ba270?format=webp&width=200"
                alt="tiktok"
                className="w-5 h-5"
              />
            </a>
          </div>
        </div>

        <div>
          <div className="font-semibold mb-3">Explore</div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link to="/?q=">All Food</Link>
            </li>
            <li>
              <Link to="/?q=Nearby">Nearby</Link>
            </li>
            <li>
              <Link to="/?q=Discount">Discount</Link>
            </li>
            <li>
              <Link to="/?q=Best Seller">Best Seller</Link>
            </li>
            <li>
              <Link to="/?q=Delivery">Delivery</Link>
            </li>
            <li>
              <Link to="/?q=Lunch">Lunch</Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-3">Help</div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a href="#">How to Order</a>
            </li>
            <li>
              <a href="#">Payment Methods</a>
            </li>
            <li>
              <a href="#">Track My Order</a>
            </li>
            <li>
              <a href="#">FAQ</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

import React from "react";

const reviews = [
  {
    id: 1,
    name: "John Shance",
    rating: 5,
    comment: "Sangat rekomendasi tempat potong rambut di kota ini, potongan rapi, gaya juga modern.",
  },
  {
    id: 2,
    name: "William Palmer",
    rating: 5,
    comment: "sangat berpengalaman di tempat cukur yg modern, recomended banget potong rambut di sini, dan yg terpenting pelayanan memuaskan, saat datang pun pelayanan memuaskan.",
  },
  {
    id: 3,
    name: "Alex Henderson",
    rating: 5,
    comment: "Tempatnya bersih, barber ramah, sangat nyaman untuk potong rambut.",
  },
  {
    id: 4,
    name: "Septian Nugraha",
    rating: 5,
    comment: "Pelayanannya ramah, potongan rambut rapi, dan nyaman untuk santai.",
  },
  {
    id: 5,
    name: "Hendri Wijaya",
    rating: 5,
    comment: "Tempatnya nyaman, bersih, dan pelayanan ramah. Potongannya rapi, cocok dengan saya.",
  },
];

export default function Reviews() {
  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 text-[#FFCC00]"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clipRule="evenodd"
            />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="bg-black py-24 border-t border-neutral-900/60">
      <div className="max-w-7xl mx-auto px-6">
        {/* TITLE */}
        <div className="text-center mb-16">
          <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight">
            Ulasan Pelanggan
          </h2>
          <p className="text-gray-400 text-sm md:text-base mt-4 max-w-[600px] mx-auto leading-relaxed">
            Apa kata pelanggan setelah mencoba layanan kami
          </p>
        </div>

        {/* REVIEW GRID */}
        <div className="space-y-8">
          {/* TOP ROW: 3 CARDS */}
          <div className="flex flex-wrap justify-center gap-8">
            {reviews.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="bg-[#1C1C1E] border border-neutral-800/50 rounded-2xl p-6 w-full max-w-[360px] min-h-[180px] flex flex-col justify-start transition-all duration-300 hover:border-neutral-700/60 shadow-xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  {/* AVATAR ICON */}
                  <div className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900/40 flex items-center justify-center text-neutral-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold">{review.name}</h4>
                    <div className="mt-1">{renderStars()}</div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed text-left">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>

          {/* BOTTOM ROW: 2 CARDS CENTERED */}
          <div className="flex flex-wrap justify-center gap-8">
            {reviews.slice(3, 5).map((review) => (
              <div
                key={review.id}
                className="bg-[#1C1C1E] border border-neutral-800/50 rounded-2xl p-6 w-full max-w-[360px] min-h-[180px] flex flex-col justify-start transition-all duration-300 hover:border-neutral-700/60 shadow-xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  {/* AVATAR ICON */}
                  <div className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900/40 flex items-center justify-center text-neutral-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold">{review.name}</h4>
                    <div className="mt-1">{renderStars()}</div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed text-left">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

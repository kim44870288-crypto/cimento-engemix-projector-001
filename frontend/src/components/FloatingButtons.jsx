import { useEffect, useState } from "react";
import { track } from "@/lib/tracker";
import { api } from "@/lib/api";

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);
  const [waHref, setWaHref] = useState(
    "https://wa.me/554121122023?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento."
  );

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    api
      .get("/config/public")
      .then((r) => {
        if (!mounted) return;
        const digits = (r.data.whatsapp_number || "").replace(/\D/g, "");
        const msg = encodeURIComponent(r.data.whatsapp_message || "");
        setWaHref(`https://wa.me/${digits}${msg ? `?text=${msg}` : ""}`);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      {/* Right side floaters */}
      <aside
        className="fixed right-0 bottom-24 lg:bottom-1/4 z-40"
        data-testid="floating-actions"
      >
        <menu className="flex flex-col justify-end items-end gap-3 m-0 p-0">
          {/* WhatsApp */}
          <li>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="float-whatsapp"
              aria-label="Fale conosco no WhatsApp"
              onClick={() => track("whatsapp_click", { source: "floating" })}
              className="block hover:scale-110 transition-transform duration-300"
            >
              <svg
                width="56"
                height="56"
                viewBox="0 0 70 70"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg"
              >
                <path
                  d="M2.2 34.5c0 5.8 1.5 11.4 4.4 16.4L2 68l17.4-4.5a33 33 0 1 0-17.2-29"
                  fill="url(#wa-bg-a)"
                />
                <path
                  d="M1 34.5a34 34 0 0 0 4.6 17L.8 69.2l18-4.8A34.1 34.1 0 1 0 1 34.4Zm10.8 16.1-.7-1a28.2 28.2 0 0 1 24-43.4 28.2 28.2 0 0 1 28.4 28.3 28.3 28.3 0 0 1-42.8 24.4l-1-.6L9 61l2.8-10.5Z"
                  fill="url(#wa-bg-b)"
                />
                <path
                  d="M26.6 20.2c-.6-1.4-1.3-1.4-1.9-1.4h-1.6c-.6 0-1.5.2-2.3 1-.8.9-3 3-3 7.1 0 4.2 3 8.3 3.5 8.8.4.6 5.9 9.5 14.5 12.9 7.2 2.8 8.7 2.3 10.3 2.1 1.5-.1 5-2 5.7-4 .7-2 .7-3.7.5-4a142.4 142.4 0 0 0-7.5-3.8c-.7-.3-1.3-.5-1.9.4-.5.8-2.2 2.7-2.6 3.3-.5.6-1 .6-1.9.2-.8-.4-3.6-1.3-6.8-4.2-2.6-2.3-4.3-5-4.8-5.9-.5-.9 0-1.3.4-1.7l1.3-1.5c.4-.5.5-.9.8-1.5.3-.5.2-1 0-1.4l-2.7-6.4Z"
                  fill="#fff"
                />
                <defs>
                  <linearGradient id="wa-bg-a" x1="34" y1="1" x2="34" y2="68" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#60D669" />
                    <stop offset="1" stopColor="#1FAF38" />
                  </linearGradient>
                  <linearGradient id="wa-bg-b" x1="35" y1="1" x2="35" y2="69" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F9F9F9" />
                    <stop offset="1" stopColor="#fff" />
                  </linearGradient>
                </defs>
              </svg>
            </a>
          </li>
        </menu>
      </aside>

      {/* Back to top */}
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Voltar ao topo"
          data-testid="back-to-top"
          className="fixed left-2 lg:left-4 bottom-6 z-40 w-12 h-12 flex justify-center items-center bg-[#0000bf] rounded-xl shadow-lg hover:bg-[#00009c] transition"
        >
          <svg
            width="18"
            height="22"
            viewBox="0 0 48 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.15597 26.669C1.36859 25.8813 0.926268 24.8132 0.926268 23.6996C0.926268 22.5859 1.36859 21.5178 2.15597 20.7302L21.056 1.83015C21.8436 1.04277 22.9117 0.600451 24.0254 0.600451C25.1391 0.600451 26.2072 1.04277 26.9948 1.83015L45.8948 20.7302C46.6598 21.5223 47.0832 22.5832 47.0736 23.6844C47.064 24.7857 46.6223 25.8391 45.8436 26.6178C45.0649 27.3965 44.0115 27.8382 42.9103 27.8478C41.809 27.8573 40.7481 27.434 39.956 26.669L28.2254 15.2996V55.4996C28.2254 56.6135 27.7829 57.6818 26.995 58.4695C26.2072 59.2573 25.139 59.6996 24.0254 59.6996C22.9117 59.6996 21.8436 59.2573 21.0557 58.4695C20.2679 57.6818 19.8254 56.6135 19.8254 55.4996V15.2996L8.09477 26.669C7.30707 27.4562 6.23897 27.8985 5.12537 27.8985C4.01177 27.8985 2.94367 27.4562 2.15597 26.669Z"
              fill="white"
            />
          </svg>
        </button>
      )}
    </>
  );
}

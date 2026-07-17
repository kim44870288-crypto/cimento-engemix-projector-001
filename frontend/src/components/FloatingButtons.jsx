import { useEffect, useState } from "react";

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Right side floaters */}
      <aside
        className="fixed right-0 bottom-24 lg:bottom-1/4 z-40"
        data-testid="floating-actions"
      >
        <menu className="flex flex-col justify-end items-end gap-3 m-0 p-0">
          {/* Calculadora */}
          <li>
            <a
              href="#"
              data-testid="float-calc"
              aria-label="Calculadora de Concreto"
              className="w-12 h-12 flex justify-center items-center bg-[#790800] rounded-l-xl shadow-lg hover:bg-[#5c0600] transition"
            >
              <svg
                width="29"
                height="40"
                className="w-5 h-6 transition-transform duration-500 hover:scale-110"
                viewBox="0 0 29 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.60985 0H24.3901C25.4393 0 26.4455 0.421427 27.1874 1.17157C27.9293 1.92172 28.3461 2.93913 28.3461 4V36C28.3461 37.0609 27.9293 38.0783 27.1874 38.8284C26.4455 39.5786 25.4393 40 24.3901 40H4.60985C3.56064 40 2.55441 39.5786 1.81251 38.8284C1.0706 38.0783 0.653809 37.0609 0.653809 36V4C0.653809 2.93913 1.0706 1.92172 1.81251 1.17157C2.55441 0.421427 3.56064 0 4.60985 0ZM4.60985 4V12H24.3901V4H4.60985ZM4.60985 16V20H8.5659V16H4.60985ZM12.5219 16V20H16.478V16H12.5219ZM20.434 16V20H24.3901V16H20.434ZM4.60985 24V28H8.5659V24H4.60985ZM12.5219 24V28H16.478V24H12.5219ZM20.434 24V28H24.3901V24H20.434ZM4.60985 32V36H8.5659V32H4.60985ZM12.5219 32V36H16.478V32H12.5219ZM20.434 32V36H24.3901V32H20.434Z"
                  fill="white"
                />
              </svg>
            </a>
          </li>

          {/* WhatsApp */}
          <li>
            <a
              href="#"
              data-testid="float-whatsapp"
              aria-label="Fale conosco no WhatsApp"
              className="w-14 h-14 mr-2 flex justify-center items-center rounded-full bg-[#25D366] shadow-lg hover:scale-110 transition-transform duration-300"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 77 77"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.92886 38.0392C1.92707 44.5087 3.61749 50.8257 6.83179 56.3936L1.62146 75.4173L21.0899 70.3127C26.4746 73.2441 32.5078 74.7801 38.6388 74.7804H38.6549C58.8942 74.7804 75.3696 58.3111 75.3782 38.0682C75.3821 28.259 71.5655 19.0351 64.6313 12.0956C57.6984 5.15662 48.4778 1.33318 38.6534 1.3287C18.4116 1.3287 1.93752 17.7972 1.92916 38.0392"
                  fill="#25D366"
                />
                <path
                  d="M29.1521 22.1295C28.44 20.5468 27.6905 20.5148 27.0134 20.4871C26.4588 20.4632 25.8249 20.465 25.1916 20.465C24.5577 20.465 23.5278 20.7035 22.6572 21.654C21.7857 22.6055 19.3301 24.9047 19.3301 29.5811C19.3301 34.2578 22.7363 38.7773 23.2114 39.4118C23.687 40.0455 29.7862 49.9503 39.4494 53.7607C47.4791 56.9269 49.1148 56.2965 50.8579 56.1378C52.6012 55.9793 56.4832 53.8398 57.276 51.6218C58.0691 49.4041 58.0691 47.5033 57.8313 47.1058C57.5936 46.7101 56.9597 46.4724 56.0086 45.9968C55.0574 45.5212 50.3806 43.2214 49.5087 42.9036C48.6367 42.5859 48.003 42.4276 47.3691 43.3794C46.7352 44.3299 44.9146 46.4724 44.3599 47.1058C43.8058 47.7405 43.2515 47.8199 42.3006 47.3443C41.3491 46.8672 38.2839 45.864 34.6479 42.6234C31.8189 40.1013 29.9107 36.9863 29.3564 36.0345C28.802 35.0836 29.297 34.5691 29.7742 34.095C30.2016 33.6688 30.7254 32.9846 31.2013 32.4299C31.6759 31.8749 31.8342 31.4788 32.152 30.8452C32.4697 30.2107 32.311 29.6557 32.0733 29.1798C31.8342 28.7057 29.9871 24.0053 29.1521 22.1295Z"
                  fill="white"
                />
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

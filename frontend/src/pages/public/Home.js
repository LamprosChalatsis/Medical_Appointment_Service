import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import HeroImage from "../../assets/doctor3.png";

const SPECIALTIES = [
  "Cardiology",
  "Dermatology",
  "General practice",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
];

export default function Home() {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const results = SPECIALTIES.filter((s) =>
    s.toLowerCase().includes(query.trim().toLowerCase())
  );

  const goToDoctors = () => navigate("/doctors");

  const handleAppointmentClick = () => {
    const token = localStorage.getItem("token");
    if (token) navigate("/doctors");
    else navigate("/login");
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearched(true);
  };

  const focusSearch = () => {
    searchRef.current?.focus();
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <MainLayout>
      <div className="bg-[#F5F9FA] text-[#0C2340] font-sans">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          {/* HERO */}
          <section className="grid grid-cols-12 items-start gap-6 pb-12 pt-10 sm:pb-20 sm:pt-16">
            <div className="col-span-12 lg:col-span-7 lg:pr-8">
              <span className="mb-5 block text-xs font-semibold uppercase tracking-[0.18em] text-[#2D8A9E]">
                A more considered way to find care / 01
              </span>
              <h1 className="mb-8 max-w-2xl font-serif text-[clamp(2.3rem,4.5vw,4.2rem)] leading-[1.15] sm:mb-11">
                Healthcare, made{" "}
                <em className="font-normal">more personal.</em>
              </h1>

              <div className="max-w-xl border-t border-[#0C2340]/10 pt-6 sm:pt-8">
                <p className="mb-7 max-w-md text-base leading-relaxed text-[#0C2340]/65 sm:text-lg">
                  Find verified doctors and book an appointment with confidence.
                  A clearer path to the care you need.
                </p>

                <form
                  onSubmit={handleSearch}
                  className="flex flex-col gap-3 sm:flex-row sm:gap-4"
                  role="search"
                >
                  <label className="relative flex-1">
                    <span className="sr-only">Search by specialty</span>
                    <input
                      ref={searchRef}
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setSearched(false);
                      }}
                      placeholder="Search by specialty"
                      className="h-14 w-full border border-[#0C2340]/20 bg-white px-4 text-sm text-[#0C2340] placeholder:text-[#0C2340]/45 focus:border-[#2D8A9E] focus:outline-none focus:ring-1 focus:ring-[#2D8A9E]"
                    />
                  </label>
                  <button
                    type="submit"
                    className="h-14 shrink-0 bg-[#2D8A9E] px-7 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#257485]"
                  >
                    Search
                  </button>
                </form>

                {searched && (
                  <div
                    className="mt-6 border-t border-[#0C2340]/10 pt-4"
                    aria-live="polite"
                  >
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#0C2340]/55">
                      {results.length
                        ? "Matching specialties"
                        : "No matching specialties"}
                    </p>
                    {results.length ? (
                      <div className="flex flex-wrap gap-x-5 gap-y-2">
                        {results.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={goToDoctors}
                            className="text-sm text-[#0C2340] underline decoration-[#2D8A9E] decoration-1 underline-offset-4 transition-colors hover:text-[#2D8A9E]"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#0C2340]/65">
                        Try a different specialty.
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
                  <button
                    onClick={handleAppointmentClick}
                    className="bg-[#0C2340] px-7 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#F5F9FA] transition-colors hover:bg-[#143156]"
                  >
                    Book an appointment
                  </button>
                  <button
                    onClick={goToDoctors}
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0C2340] transition-colors hover:text-[#2D8A9E]"
                  >
                    Browse doctors
                  </button>
                </div>
              </div>
            </div>

            <figure className="col-span-12 mt-6 lg:col-span-5 lg:mt-0">
              <div className="h-[220px] overflow-hidden bg-[#C7E5E5] sm:h-auto sm:aspect-[3/4]">
                <img
                  src={HeroImage}
                  alt="Doctor listening to a patient during a consultation"
                  className="h-full w-full object-cover object-[center_30%]"
                />
              </div>
              <figcaption className="mt-3 text-right text-xs uppercase tracking-[0.14em] text-[#0C2340]/55">
                Care begins with a conversation
              </figcaption>
            </figure>
          </section>

          {/* ACCESS TO CARE */}
          <section className="grid grid-cols-12 gap-x-6 gap-y-8 border-t border-[#0C2340]/10 py-16 sm:py-20">
            <h2 className="col-span-12 text-xs font-semibold uppercase tracking-[0.18em] text-[#2D8A9E] lg:col-span-3">
              Access to care
            </h2>
            <div className="col-span-12 grid gap-10 md:grid-cols-2 md:gap-16 lg:col-span-9">
              <div>
                <h3 className="mb-4 font-serif text-2xl leading-snug">
                  A simpler search
                </h3>
                <p className="max-w-sm text-sm leading-relaxed text-[#0C2340]/65">
                  Look for the right specialty without sorting through noise.
                  Start with the care you need, then take the next step at your
                  pace.
                </p>
              </div>
              <div>
                <h3 className="mb-4 font-serif text-2xl leading-snug">
                  People before process
                </h3>
                <p className="max-w-sm text-sm leading-relaxed text-[#0C2340]/65">
                  Good healthcare is a relationship. Finding a doctor should
                  feel straightforward, respectful, and centered on you.
                </p>
              </div>
            </div>
          </section>

          {/* APPROACH */}
          <section className="grid grid-cols-12 gap-6 pb-20 sm:pb-28">
            <div className="col-span-12 overflow-hidden bg-[#C7E5E5] lg:col-span-8">
              <img
                src={HeroImage}
                alt="Clinician in a bright practice"
                loading="lazy"
                className="h-64 w-full object-cover object-top sm:h-80"
              />
            </div>
            <div className="col-span-12 flex flex-col justify-end lg:col-span-4">
              <div className="mb-7 h-px w-full bg-[#0C2340]/10" />
              <p className="max-w-sm font-serif text-xl italic leading-relaxed sm:text-2xl">
                The best care starts when someone takes the time to listen.
              </p>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="bg-[#0C2340] px-5 py-16 text-[#F5F9FA] sm:px-6 sm:py-20">
          <div className="mx-auto grid max-w-7xl grid-cols-12 gap-x-6 gap-y-12">
            <div className="col-span-12 lg:col-span-6">
              <span className="mb-6 block font-serif text-3xl">
                MediBook<span className="text-[#C7E5E5]">.</span>
              </span>
              <p className="max-w-sm text-sm leading-relaxed opacity-70">
                A more thoughtful connection between people and the care they
                need.
              </p>
            </div>
            <div className="col-span-6 lg:col-span-3">
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] opacity-60">
                Explore
              </h2>
              <ul className="space-y-3 text-sm">
                <li>
                  <button onClick={goToDoctors} className="hover:underline">
                    Doctors
                  </button>
                </li>
                <li>
                  <button onClick={focusSearch} className="hover:underline">
                    Find care
                  </button>
                </li>
              </ul>
            </div>
            <div className="col-span-6 lg:col-span-3">
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] opacity-60">
                Your account
              </h2>
              <ul className="space-y-3 text-sm">
                <li>
                  <button
                    onClick={() => navigate("/login")}
                    className="hover:underline"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/register")}
                    className="hover:underline"
                  >
                    Create account
                  </button>
                </li>
              </ul>
            </div>
            <div className="col-span-12 flex flex-col justify-between gap-4 border-t border-[#F5F9FA]/15 pt-8 text-xs uppercase tracking-[0.14em] opacity-60 sm:flex-row">
              <span>© {new Date().getFullYear()} MediBook</span>
              <span>Care starts here</span>
            </div>
          </div>
        </footer>
      </div>
    </MainLayout>
  );
}
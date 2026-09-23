import "../index.css";
import Header from "../components/Header";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen relative">
      <div className="background" />

      <div className="relative z-10">
        <Header />
        <main className="pt-20">{children}</main>
      </div>
    </div>
  );
}
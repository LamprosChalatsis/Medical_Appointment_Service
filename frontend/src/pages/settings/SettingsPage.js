import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import ProfileInfoCard from "../../components/settings/ProfileInfoCard";
import AllergiesCard from "../../components/settings/AllergiesCard";
import SpecialtiesCard from "../../components/settings/SpecialtiesCard";

export default function SettingsPage() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen pt-10">
        <div className="max-w-5xl mx-auto space-y-6 px-6">

          <h1 className="text-3xl font-bold text-gray-900">
            Settings
          </h1>

          <ProfileInfoCard />

          {role === "ROLE_PATIENT" && <AllergiesCard />}

          {role === "ROLE_DOCTOR" && <SpecialtiesCard />}


        </div>
      </div>
    </MainLayout>
  );
}
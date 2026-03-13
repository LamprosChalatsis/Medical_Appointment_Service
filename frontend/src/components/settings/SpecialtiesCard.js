import { useEffect, useState } from "react";
import {
  fetchSpecialties,
  getDoctorSpecialties,
  addSpecialty,
  removeSpecialty
} from "../../api/specialties";
import AlertDialog from "../SuccessAlert";


export default function SpecialtiesCard() {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [specialties, setSpecialties] = useState([]);
  const [doctorSpecialties, setDoctorSpecialties] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const all = await fetchSpecialties();
      const doctor = await getDoctorSpecialties();
      setSpecialties(all);
      setDoctorSpecialties(doctor);
    } catch (err) {
      console.error("Failed to load specialties", err);
    }
  };

  const handleAdd = async () => {
    if (!selected) return;

    try {
      const id = Number(selected);

      await addSpecialty(id);
      setAlertTitle("Success!");
      setAlertMessage("Specialty added successfully");
      setAlertOpen(true);

      const added = specialties.find(s => s.id === id);

      setDoctorSpecialties([...doctorSpecialties, added]);
      setSelected("");

    } catch (err) {
      console.error("Failed to add specialty", err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeSpecialty(id);

      setDoctorSpecialties(
        doctorSpecialties.filter(s => s.id !== id)
      );
      setAlertTitle("Success!");
      setAlertMessage("Specialty removed successfully");
      setAlertOpen(true);
    } catch (err) {
      console.error("Failed to remove specialty", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <AlertDialog
        open={alertOpen}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
      

      <h2 className="text-lg font-semibold mb-4">
        Specialties
      </h2>

      {/* Add Specialty */}
      <div className="flex gap-2 mb-4">

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border rounded-lg p-2 flex-1"
        >
          <option value="">Select specialty</option>

          {specialties
            .filter(s => !doctorSpecialties.some(d => d.id === s.id))
            .map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </option>
            ))}

        </select>

        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add
        </button>

      </div>

      {/* Doctor Specialties */}
      <div className="space-y-2">

        {doctorSpecialties.length === 0 && (
          <p className="text-gray-500 text-sm">
            No specialties added
          </p>
        )}

        {doctorSpecialties.map((specialty) => (
          <div
          key={`specialty-${specialty.id}`}
            className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg"
          >
            <span>{specialty.name}</span>

            <button
              onClick={() => handleRemove(specialty.id)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}

      </div>

    </div>
  );
}
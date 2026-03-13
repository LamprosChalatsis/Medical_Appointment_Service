import { useEffect, useState } from "react";
import {
  getAllAllergies,
  getPatientAllergies,
  addAllergy,
  removeAllergy
} from "../../api/allergies";
import AlertDialog from "../SuccessAlert";


export default function AllergiesCard() {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [allergies, setAllergies] = useState([]);
  const [patientAllergies, setPatientAllergies] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const all = await getAllAllergies();
      const patient = await getPatientAllergies();

      setAllergies(all);
      setPatientAllergies(patient);
    } catch (err) {
      console.error("Failed to load allergies", err);
    }
  };

  const handleAdd = async () => {
    if (!selected) return;

    try {
      const id = Number(selected);
      await addAllergy(id);
      const added = allergies.find(a => a.id === id);

      setAlertTitle("Success!");
      setAlertMessage("Allergy added successfully");
      setAlertOpen(true);

      setPatientAllergies([...patientAllergies, added]);
      setSelected("");

    } catch (err) {
      console.error("Failed to add allergy", err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeAllergy(id);

      setPatientAllergies(
        patientAllergies.filter(a => a.id !== id)
      );
      setAlertTitle("Success!");
      setAlertMessage("Allergy removed successfully");
      setAlertOpen(true);
    } catch (err) {
      console.error("Failed to remove allergy", err);
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
        Allergies
      </h2>

      {/* Add Allergy */}
      <div className="flex gap-2 mb-4">

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border rounded-lg p-2 flex-1"
        >
          <option value="">Select allergy</option>
          {allergies.map((allergy) => (
            <option key={`allergy-${allergy.id}`} value={allergy.id}>
              {allergy.allergy}
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

      {/* Patient Allergies */}
      <div className="space-y-2">

        {patientAllergies.length === 0 && (
          <p className="text-gray-500 text-sm">
            No allergies added
          </p>
        )}

        {patientAllergies.map((allergy) => (
          <div
            key={allergy.id}
            className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg"
          >
            <span>{allergy.allergy}</span>

            <button
              onClick={() => handleRemove(allergy.id)}
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
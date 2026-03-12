// Check if a JWT token is valid and not expired
export function checkJWT(token) {
  try {
    if (!token) return false;

    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));

    if (!payload.exp) return false;

    const currentTime = Math.floor(Date.now() / 1000);

    return currentTime < payload.exp;
  } catch {
    return false;
  }
}

// Check if user is logged in
export function isLoggedIn() {
  const token = localStorage.getItem("token");

  if (!checkJWT(token)) {
    clearAuthStorage();
    return false;
  }

  return true;
}

// Get the user's main role
export function getPrimaryRole() {
  return localStorage.getItem("role");
}

// Save login session data
export function saveAuthSession(data) {
  localStorage.setItem("token", data.accessToken || "");
  localStorage.setItem("roles", JSON.stringify(data.roles || []));
  localStorage.setItem("role", data.roles?.[0] || "");
  localStorage.setItem("username", data.username || "");

  if (data.patientID != null) {
    localStorage.setItem("patientID", String(data.patientID));
  } else {
    localStorage.removeItem("patientID");
  }

  if (data.doctorID != null) {
    localStorage.setItem("doctorID", String(data.doctorID));
  } else {
    localStorage.removeItem("doctorID");
  }
}

// Remove all authentication data
export function clearAuthStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("roles");
  localStorage.removeItem("patientID");
  localStorage.removeItem("doctorID");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
}
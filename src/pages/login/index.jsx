
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export const metadata = {
  title: "Invest",
  description: "Invest",
};

export default function LoginForm() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError("Both fields are required");
      return;
    }
    setError("");


    if(formData?.username === "Zenithkhan@#1234" && formData?.password === "Zenithpharmaindia"){
        localStorage.setItem("adminCredential",JSON.stringify(formData))

        router.push("/dashboard");
    }
    else {
        alert("Invalid Credentials! Try Again...");
        return;
    }

    console.log("Logging in with", formData);
    // Implement login logic here
  };


  useEffect(() => {
    const adminCredentialStored= localStorage.getItem("adminCredential");
      if(adminCredentialStored){
        const storedAdmin = JSON.parse(adminCredentialStored);
        if(storedAdmin?.username === "Zenithkhan@#1234" && storedAdmin?.password === "Zenithpharmaindia"){
            router.push("/dashboard");
        }
        else {
            localStorage.removeItem("adminCredential");
        }
      }
  }, [])

  return (
    <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "#f3f4f6", padding: "16px" }}>
      <div style={{ width: "100%",paddingBottom:'50px', maxWidth: "300px", padding: "24px", backgroundColor: "white", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", borderRadius: "16px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", color: "#1f2937", marginBottom: "24px" }}>Login</h2>
        {error && <p style={{ color: "red", fontSize: "14px", textAlign: "center", marginBottom: "16px" }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ position: "relative", display:'flex' }}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px 20px", borderRadius: "8px", border: "1px solid #d1d5db" }}
            />
          </div>
          <div style={{ position: "relative", display:'flex' }}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px 20px", borderRadius: "8px", border: "1px solid #d1d5db" }}
            />
          </div>
          <button type="submit" style={{ width: "100%",  backgroundColor: "#2563eb", color: "white", padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
            Login
          </button>
        </form>
        {/* <p style={{ textAlign: "center", fontSize: "14px", color: "#6b7280", marginTop: "16px" }}>
          Don't have an account? <a href="#" style={{ color: "#2563eb", textDecoration: "underline" }}>Sign up</a>
        </p> */}
      </div>
    </div>
  );
}

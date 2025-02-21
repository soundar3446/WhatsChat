import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [formData, setFormData] = useState({ name: "", phoneNumber: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch("http://localhost:5000/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Signup failed");
            }

            alert("Signup successful!");
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    const styles = {
        pageContainer: { 
            display: "flex", justifyContent: "center", alignItems: "center",
            height: "100vh", backgroundColor: "#23272A", color: "#fff"
        },
        formContainer: { 
            backgroundColor: "#2C2F33", padding: "40px", borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.3)", width: "350px"
        },
        input: { 
            backgroundColor: "#40444B", border: "none", color: "#fff",
            marginBottom: "10px", padding: "10px", borderRadius: "5px"
        },
        button: { 
            backgroundColor: "#5865F2", border: "none", padding: "10px",
            color: "#fff", fontWeight: "bold", borderRadius: "5px", width: "100%",
            cursor: "pointer"
        },
        link: { color: "#00AFF4", textDecoration: "none" }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.formContainer}>
                <h3 className="text-center mb-4">Create an Account</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" className="form-control" placeholder="Username" style={styles.input} onChange={handleChange} required />
                    <input type="text" name="phoneNumber" className="form-control" placeholder="Phone Number" style={styles.input} onChange={handleChange} required />
                    <input type="password" name="password" className="form-control" placeholder="Password" style={styles.input} onChange={handleChange} required />
                    <button type="submit" className="btn" style={styles.button}>Sign Up</button>
                </form>
                <p className="text-center mt-3">Already have an account? <a href="/" style={styles.link}>Login</a></p>
            </div>
        </div>
    );
};

export default Signup;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({ phoneNumber: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
    
        console.log("Sending login request with:", formData); // Debugging
    
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
            console.log("Response received:", data); // Debugging
    
            if (!response.ok) {
                throw new Error(data.error || "Login failed");
            }
    
            // ✅ Store full user data
            if (data.user && data.user._id) {
                const user = {
                    _id: data.user._id,
                    name: data.user.name || "Unknown",
                    phoneNumber: data.user.phoneNumber,
                };
    
                // ✅ Store token, user ID, and full user object
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", user._id);
                localStorage.setItem("phoneNumber", user.phoneNumber);
                localStorage.setItem("user", JSON.stringify(user)); // Store full user object
    
                console.log("📦 User stored in localStorage:", user);
                alert("Login successful!");
                navigate("/chat"); // Redirect to chat page
            } else {
                throw new Error("User data is missing from the response");
            }
        } catch (err) {
            console.error("Error:", err); // Debugging
            setError(err.message);
        }
    };
   
    const styles = {
        pageContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", /* Full viewport height */
            width: "100vw", /* Full viewport width */
            backgroundColor: "#23272A",
            color: "#fff",
            backgroundImage: "url('https://www.w3schools.com/w3images/forestbridge.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            overflow: "hidden",
        },
        modalOverlay: {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1,
        },
        formContainer: {
            backgroundColor: "#2C2F33",
            padding: "40px",
            borderRadius: "10px",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
            width: "90%", /* Adjust width to fit screen */
            maxWidth: "500px", /* Prevent overflow on large screens */
            boxSizing: "border-box", /* Ensure padding is within width */
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            zIndex: 2,
            position: "relative",
        },
        input: {
            backgroundColor: "#40444B",
            border: "none",
            color: "#fff",
            marginBottom: "15px",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "16px",
            transition: "border-color 0.3s ease",
        },
        inputFocus: {
            borderColor: "#5865F2",
            boxShadow: "0 0 0 2px rgba(88,101,242,0.5)"
        },
        button: {
            backgroundColor: "#5865F2",
            border: "none",
            padding: "12px",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "8px",
            width: "100%",
            cursor: "pointer",
            transition: "background-color 0.3s ease"
        },
        buttonHover: {
            backgroundColor: "#4752C4"
        },
        link: {
            color: "#00AFF4",
            textDecoration: "none",
            fontWeight: "500",
            fontSize: "14px"
        },
        errorMessage: {
            color: "#ff4d4d",
            backgroundColor: "#ffcccc",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            textAlign: "center"
        }
    };
    
    

    const handleInputFocus = (e) => {
        e.target.style.borderColor = "#5865F2";
        e.target.style.boxShadow = "0 0 0 2px rgba(88,101,242,0.5)";
    };

    const handleInputBlur = (e) => {
        e.target.style.borderColor = "#40444B";
        e.target.style.boxShadow = "none";
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.modalOverlay}></div>
            <div style={styles.formContainer}>
                <h3 className="text-center mb-4" style={{ fontSize: "24px", fontWeight: "600", color: "#fff" }}>Welcome Back</h3>
                {error && <div style={styles.errorMessage}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="phoneNumber" 
                        className="form-control" 
                        placeholder="Phone Number" 
                        style={styles.input} 
                        onChange={handleChange} 
                        onFocus={handleInputFocus} 
                        onBlur={handleInputBlur}
                        required 
                    />
                    <input 
                        type="password" 
                        name="password" 
                        className="form-control" 
                        placeholder="Password" 
                        style={styles.input} 
                        onChange={handleChange} 
                        onFocus={handleInputFocus} 
                        onBlur={handleInputBlur}
                        required 
                    />
                    <button 
                        type="submit" 
                        className="btn" 
                        style={styles.button}
                        onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor} 
                        onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
                    >
                        Login
                    </button>
                </form>
                <p className="text-center mt-3" style={{ color: "#fff" }}>
                    Don't have an account? <a href="/signup" style={styles.link}>Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;

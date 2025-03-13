import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShortUrl("");

    try {
      const response = await axios.post("http://localhost:8000/shorten/", { url });
      setShortUrl(response.data.short_url);
      toast.success("URL successfully shortened!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to shorten URL");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>URL Shortener with Security Check</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{ padding: "10px", width: "60%" }}
        />
        <button type="submit" style={{ padding: "10px 20px", marginLeft: "10px" }}>
          Shorten
        </button>
      </form>
      {shortUrl && (
        <p>
          Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
        </p>
      )}
      <ToastContainer />
    </div>
  );
};

export default App; 
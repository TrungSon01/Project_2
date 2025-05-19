import React, { useState, useEffect } from "react";
import MapPicker from "./MapPicker";
import "./PostForm.css";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loadingSlice";
import imageCompression from "browser-image-compression";
import { createPost } from "../../apis/postFormService";
import Form from "antd/es/form/Form";
import { Descriptions } from "antd";
import toast from "react-hot-toast";
function PostForm() {
  const [locationOption, setLocationOption] = useState("current");
  const [coords, setCoords] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [address, setAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const userAccount = JSON.parse(localStorage.getItem("userAccount") || "{}");
  const email = userAccount.email || "";

  const [form, setForm] = useState({
    email: email,
    species: "",
    breed: "",
    descriptions: "",
  });

  const dispatch = useDispatch();

  // Hàm tìm kiếm địa chỉ
  const handleAddressSearch = async () => {
    if (!address.trim()) return;
    setIsSearching(true);
    try {
      dispatch(showLoading());
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await response.json();
      dispatch(hideLoading());
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCoords({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
        setLocationOption("map");
      } else {
        alert("Không tìm thấy địa chỉ phù hợp!");
      }
    } catch (err) {
      alert("Lỗi khi tìm kiếm địa chỉ!");
    }
    setIsSearching(false);
  };

  // Lấy vị trí hiện tại
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ định vị.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
      },
      (error) => {
        alert("Không lấy được vị trí: " + error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (locationOption === "current") {
      getCurrentLocation();
    }
  }, [locationOption]);

  // Xử lý khi chọn file ảnh
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const options = {
        maxSizeMB: 0.1, // giảm xuống 0.3 MB ~ 300KB
        maxWidthOrHeight: 200, // giảm kích thước ảnh
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(file, options);
        setImagePreview(URL.createObjectURL(compressedFile));
        const reader = new FileReader();
        reader.onloadend = () => setImageBase64(reader.result);
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        alert("Không thể xử lý ảnh.");
      }
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!coords) {
      alert("Vui lòng chọn vị trí!");
      return;
    }
    if (!form.email || !form.species || !form.breed) {
      console.log("email", email);
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    const postData = {
      email: form.email,
      species: form.species,
      breed: form.breed,
      latitude: coords.latitude,
      longitude: coords.longitude,
      image: imageBase64,
      descriptions: form.descriptions,
      post_time: Date.now(),
    };
    console.log("imageBase64", imageBase64.slice(0, 100));
    console.log("time", Date.now());
    try {
      dispatch(showLoading());
      await createPost(postData);
      toast.success("Đã gửi bài thành công!");
      setForm({ email: "", species: "", breed: "" });
      setImageBase64("");
      setImagePreview(null);
      setCoords(null);
    } catch (err) {
      toast.error("Gửi bài thất bại!");
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div className="post-container">
      <h2>Đăng bài</h2>
      <div className="dropdown-group">
        <input
          type="email"
          name="email"
          placeholder="Email"
          hidden
          value={form.email}
          readOnly
          style={{
            padding: 8,
            borderRadius: 8,
            border: "1px solid #ccc",
            backgroundColor: "#f5f5f5",
          }}
        />

        <select
          name="species"
          value={form.species}
          onChange={handleChange}
          style={{
            padding: 8,
            borderRadius: 8,
            border: "1px solid #ccc",
            width: "100%",
          }}
        >
          <option value="">-- Chọn loài --</option>
          <option value="Chó">Chó</option>
          <option value="Mèo">Mèo</option>
          <option value="Hamster">Hamster</option>
        </select>

        {/* Giống */}
        <select
          name="breed"
          value={form.breed}
          onChange={handleChange}
          style={{
            padding: 8,
            borderRadius: 8,
            border: "1px solid #ccc",
            width: "100%",
          }}
        >
          <option value="">-- Chọn giống --</option>
          <option value="Đực">Đực</option>
          <option value="Cái">Cái</option>
        </select>
      </div>
      <textarea
        name="descriptions"
        placeholder="Mô tả chi tiết..."
        value={form.descriptions}
        onChange={handleChange}
        rows={3}
        style={{
          marginTop: 12,
          width: "100%",
          padding: 5,
          borderRadius: 8,
          border: "1px solid #ccc",
          minHeight: 60,
        }}
      />
      <div className="upload-section">
        <label className="upload-label">
          <span className="icon-upload" />
          Tải ảnh của bạn
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </label>
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
          </div>
        )}
      </div>
      <div className="location-section">
        <div className="location-label">
          <span className="icon-location" />
          Chọn vị trí
        </div>
        <label className="radio-label">
          <input
            type="radio"
            value="current"
            checked={locationOption === "current"}
            onChange={() => setLocationOption("current")}
          />
          Vị trí hiện tại
        </label>
        <label className="radio-label">
          <input
            type="radio"
            value="map"
            checked={locationOption === "map"}
            onChange={() => setLocationOption("map")}
          />
          Chọn trên bản đồ
        </label>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            type="text"
            placeholder="Nhập địa chỉ để tìm tọa độ..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              flex: 1,
              borderRadius: 8,
              border: "1px solid #ccc",
              padding: 8,
            }}
          />
          <button
            type="button"
            onClick={handleAddressSearch}
            disabled={isSearching || !address.trim()}
            style={{
              borderRadius: 8,
              padding: "8px 16px",
              border: "none",
              background: "#222",
              color: "#fff",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {isSearching ? "Đang tìm..." : "Tìm"}
          </button>
        </div>
      </div>
      <div className="map-preview">
        {coords ? (
          <div>
            <p>
              <span className="icon-location" />
              Tọa độ:{" "}
              <b>
                {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
              </b>
            </p>
            <MapPicker
              coords={coords}
              onPick={setCoords}
              picking={locationOption === "map"}
            />
            {locationOption === "map" && (
              <div className="map-tip">Nhấn vào bản đồ để chọn vị trí</div>
            )}
          </div>
        ) : (
          <p>🌐 Chưa có vị trí</p>
        )}
      </div>
      <button className="submit-btn" onClick={handleSubmit}>
        Đăng bài
      </button>
    </div>
  );
}

export default PostForm;

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./postform.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function PostForm() {
  const [locationOption, setLocationOption] = useState("current");
  const [coords, setCoords] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null); // Lưu chuỗi Base64

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
      }
    );
  };

  useEffect(() => {
    if (locationOption === "current") {
      getCurrentLocation();
    }
  }, [locationOption]);

  // Xử lý khi chọn file ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));

      // Đọc file ảnh thành chuỗi Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result); // Lưu chuỗi Base64 vào state
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    console.log(imageBase64);
  };

  return (
    <div className="post-container">
      <h2>Đăng bài</h2>

      <div className="dropdown-group">
        <select>
          <option>Loài</option>
        </select>
        <select>
          <option>Giống</option>
        </select>
        <select>
          <option>Tuổi</option>
        </select>
      </div>

      <textarea placeholder="Nhập nội dung" className="text-input" />

      <div className="upload-section">
        <label>
          📤 Tải ảnh của bạn
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </label>
        {imagePreview && (
          <div className="image-preview">
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: "100%", marginTop: "10px" }}
            />
          </div>
        )}
      </div>

      <div className="location-section">
        <div className="location-label">📍 Chọn vị trí</div>
        <label>
          <input
            type="radio"
            value="current"
            checked={locationOption === "current"}
            onChange={() => setLocationOption("current")}
          />
          Vị trí hiện tại
        </label>
        <label>
          <input
            type="radio"
            value="map"
            checked={locationOption === "map"}
            onChange={() => setLocationOption("map")}
          />
          Chọn trên bản đồ
        </label>
      </div>

      <div className="map-preview">
        {coords ? (
          <div>
            <p>
              📍 Tọa độ: {coords.latitude.toFixed(5)},{" "}
              {coords.longitude.toFixed(5)}
            </p>
            <MapContainer
              center={[coords.latitude, coords.longitude]}
              zoom={15}
              scrollWheelZoom={false}
              style={{ height: "200px", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[coords.latitude, coords.longitude]} />
            </MapContainer>
          </div>
        ) : (
          <p>🌐 Chưa có vị trí</p>
        )}
      </div>

      <button onClick={handleSubmit}>Đăng bài</button>
    </div>
  );
}

export default PostForm;

import React, { useState, useEffect } from "react";
import MapPicker from "./MapPicker";
import "./PostForm.css";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loadingSlice";
import imageCompression from "browser-image-compression";
function PostForm() {
  const [locationOption, setLocationOption] = useState("current");
  const [coords, setCoords] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [address, setAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const dispatch = useDispatch();
  // ... existing code ...

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
        maxSizeMB: 1, // <= giới hạn khoảng 1MB
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        setImagePreview(URL.createObjectURL(compressedFile));

        const reader = new FileReader();
        reader.onloadend = () => setImageBase64(reader.result);
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Lỗi khi nén ảnh:", error);
        alert("Không thể xử lý ảnh.");
      }
    }
  };

  const handleSubmit = async () => {
    if (!coords) {
      alert("Vui lòng chọn vị trí!");
      return;
    }

    // Nếu không có ảnh, dùng ảnh mặc định
    const imageToSend =
      imageBase64 ||
      "https://static.wikia.nocookie.net/milomurphyslaw/images/9/9f/The_Phineas_and_Ferb_Effect_Image_133.jpg/revision/latest?cb=20190110161057&path-prefix=vi";

    const species = document.querySelectorAll("select")[0].value;
    const gender = document.querySelectorAll("select")[1].value;
    const age = document.querySelectorAll("select")[2].value;
    const description = document.querySelector(".text-input").value;

    if (!species || !gender || !age || !description.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const postData = {
      species,
      gender,
      age,
      description,
      image_url: imageToSend,
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    try {
      dispatch(showLoading());
      const response = await fetch(
        "https://681b23bf17018fe5057a3fd7.mockapi.io/login/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) throw new Error("Gửi bài thất bại!");

      const data = await response.json();
      alert("Đã gửi bài thành công!");
      console.log("Phản hồi từ API:", data);
      // reset form nếu cần
    } catch (err) {
      alert(err.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div className="post-container">
      <h2>Đăng bài</h2>
      <div className="dropdown-group">
        <select>
          <option value="">Chọn loài</option>
          <option value="dog">Chó</option>
          <option value="cat">Mèo</option>
        </select>

        <select>
          <option value="">Chọn giống</option>
          <option value="male">Đực</option>
          <option value="female">Cái</option>
        </select>

        <select>
          <option>Tuổi</option>
        </select>
      </div>
      <textarea placeholder="Nhập nội dung" className="text-input" />
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
            onChange={() => "current"}
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

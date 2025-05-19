import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./HomePage.css";
import { SlOptionsVertical } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPosts, deletePostById, setLoading } from "../redux/postSlice";
import { getPosts, deletePost, timeAgo } from "../apis/postFormService";
import toast from "react-hot-toast";

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading } = useSelector((state) => state.postSlice);
  const { user } = useSelector((state) => state.userSlice);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // Kiểm tra đăng nhập
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Gọi API lấy danh sách bài viết
  useEffect(() => {
    if (user) {
      dispatch(setLoading(true));
      getPosts()
        .then((data) => dispatch(setPosts(data)))
        .catch(() => dispatch(setPosts([])))
        .finally(() => dispatch(setLoading(false)));
    }
  }, [dispatch, user]);

  const center = posts.length
    ? [posts[0].latitude, posts[0].longitude]
    : [21.0, 105.85];

  const handleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      dispatch(deletePostById(id));
      toast.success("Đã xóa bài đăng thành công");
    } catch (error) {
      console.error("Lỗi xóa bài đăng:", error);
      toast.error("Xóa bài đăng thất bại");
    }
  };

  const handleEdit = () => {
    toast("🚧 Đang cập nhật chức năng này", {
      icon: "ℹ️",
      position: "top-right",
    });
  };

  return (
    <div className="homepage">
      <div className="sidebar">
        <div className="post-list">
          {loading ? (
            <div>Đang tải...</div>
          ) : posts.length === 0 ? (
            <div>Không có bài đăng nào.</div>
          ) : (
            posts.map((post) => (
              <div className="post-item" key={post.id}>
                <div className="post-header">
                  <div className="post-avatar-block">
                    <img src={defaultAvatar} alt="avatar" className="avatar" />
                    <div>
                      <div className="post-author text-gray-700">
                        {post.email || "Người dùng"}
                      </div>
                      <div className="post-time">
                        {post.post_time ? timeAgo(post.post_time) : ""}
                      </div>
                    </div>
                  </div>
                  <div className="post-dropdown-wrapper">
                    <button
                      className="post-dropdown-btn"
                      onClick={() => handleDropdown(post.id)}
                    >
                      <SlOptionsVertical size={18} color="gray" />
                    </button>
                    {dropdownOpen === post.id && (
                      <div className="post-dropdown-menu">
                        <div
                          className="post-dropdown-item"
                          onClick={handleEdit}
                        >
                          Chỉnh sửa
                        </div>
                        {post.email === user?.email && (
                          <div
                            className="post-dropdown-item"
                            onClick={() => handleDelete(post.id)}
                          >
                            Xóa
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="post-desc post-desc-main">
                  {post.descriptions || post.breed || "Không có mô tả"}
                </div>
                <div className="post-image-grid">
                  <div className="post-image-main">
                    {post.image ? <img src={post.image} alt="pet" /> : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="map-container">
        <MapContainer
          center={center}
          zoom={15}
          style={{ height: "100vh", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {posts.map(
            (post) =>
              post.latitude &&
              post.longitude && (
                <Marker
                  key={post.id}
                  position={[post.latitude, post.longitude]}
                  icon={customIcon}
                >
                  <Popup>
                    <b>{post.email}</b>
                    <br />
                    {post.descriptions}
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      </div>
    </div>
  );
}

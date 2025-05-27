import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./HomePage.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPosts, deletePosts, setLoading } from "../redux/postSlice";
import { getPosts, deletePost, getComments } from "../apis/postFormService";
import toast from "react-hot-toast";
import PostItem from "../components/UserPosts/PostItem";
import { getUserById } from "../apis/userService";
import PostDetail from "../components/UserPosts/PostDetail";

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading } = useSelector((state) => state.postSlice);
  const { user } = useSelector((state) => state.userSlice);

  const [usersMap, setUsersMap] = useState({}); // State để lưu usersMap
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      dispatch(setLoading(true));
      getPosts()
        .then((data) => {
          dispatch(setPosts(data));

          // Lấy danh sách user_id duy nhất
          const uniqueUserIds = [...new Set(data.map((post) => post.user_id))];

          // Gọi API để lấy thông tin từng user
          Promise.all(
            uniqueUserIds.map((id) =>
              getUserById(id).then((res) => ({ id, data: res.data }))
            )
          ).then((results) => {
            const userMap = {};
            results.forEach(({ id, data }) => {
              userMap[id] = data;
            });
            setUsersMap(userMap); // Lưu vào state
          });
        })
        .catch(() => dispatch(setPosts([])))
        .finally(() => dispatch(setLoading(false)));
    }
  }, [dispatch, user]);

  const center = posts.length
    ? [posts[0].latitude, posts[0].longitude]
    : [21.0, 105.85];

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      dispatch(deletePosts(id));
      const updatedPosts = await getPosts();
      dispatch(setPosts(updatedPosts));
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

  const handlePostClick = async (post) => {
    setSelectedPost(post);
    setCommentsLoading(true);
    try {
      const res = await getComments(post.id || post.post_id);
      setComments(res);
    } catch (err) {
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedPost(null);
    setComments([]);
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
              <PostItem
                key={post.id || post.post_id}
                post={post}
                user={user}
                onDelete={handleDelete}
                onEdit={handleEdit}
                userEmail={usersMap[post.user_id]?.email}
                onClick={handlePostClick}
              />
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
                  key={post.id || post.post_id}
                  position={[post.latitude, post.longitude]}
                  icon={customIcon}
                >
                  <Popup>
                    <b>{post.user_id}</b>
                    <br />
                    {post.description}
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      </div>
      {selectedPost && (
        <PostDetail
          post={selectedPost}
          comments={comments}
          loading={commentsLoading}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import GuestSideBar from './GuestSideBar';
import MetaData from './Layout/MetaData';

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndexes, setCurrentIndexes] = useState({});
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const bannerImages = [
    `${process.env.PUBLIC_URL}/EParokya-SampleBanner.png`,
    `${process.env.PUBLIC_URL}/EParokya2-SampleBanner.png`
  ];

  // Cycle through banner images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API}/api/v1/posts`);
      const data = await response.json();

      if (data.success) {
        setPosts(data.posts || []);
        const initialIndexes = {};
        data.posts.forEach((post) => {
          initialIndexes[post._id] = 0;
        });
        setCurrentIndexes(initialIndexes);
      } else {
        console.error("Failed to load posts:", data.message);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleNextImage = (postId) => {
    setCurrentIndexes((prevIndexes) => ({
      ...prevIndexes,
      [postId]: (prevIndexes[postId] + 1) % posts.find(post => post._id === postId).images.length,
    }));
  };

  const handlePreviousImage = (postId) => {
    setCurrentIndexes((prevIndexes) => ({
      ...prevIndexes,
      [postId]: (prevIndexes[postId] - 1 + posts.find(post => post._id === postId).images.length) % posts.find(post => post._id === postId).images.length,
    }));
  };

  return (
    <div style={styles.homeContainer}>
      <MetaData title="Home" />

      <div style={styles.contentContainer}>
        <GuestSideBar />

        <div style={styles.mainContent}>
          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search"
              style={styles.searchInput}
            />
          </div>

          {/* Banner Slider */}
          <div style={styles.bannerContainer}>
            <img
              src={bannerImages[currentBannerIndex]}
              alt="Banner"
              style={styles.bannerImage}
            />
          </div>

          <h1 style={styles.sectionTitle}>Featured Posts</h1>

          {loading ? (
            <p>Loading posts...</p>
          ) : (
            <div style={styles.postsGrid}>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post._id} style={styles.postCard}>
                    <h2 style={styles.postTitle}>{post.name}</h2>
                    <p style={styles.postDescription}>{post.description}</p>

                    {post.images.length > 0 && (
                      <div style={styles.imageCarousel}>
                        <img
                          src={post.images[currentIndexes[post._id] || 0].url}
                          alt={post.name || 'Post image'}
                          style={styles.postImage}
                        />
                        <div style={styles.carouselControls}>
                          <button
                            onClick={() => handlePreviousImage(post._id)}
                            style={styles.carouselButton}
                          >
                            Previous
                          </button>
                          <span style={styles.carouselCounter}>
                            {((currentIndexes[post._id] || 0) + 1)} / {post.images.length}
                          </span>
                          <button
                            onClick={() => handleNextImage(post._id)}
                            style={styles.carouselButton}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No posts available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  homeContainer: {
    display: 'flex',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
  mainContent: {
    flex: 1,
    padding: '40px',
    backgroundColor: '#f9f9f9',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '20px',
  },
  searchInput: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    width: '200px',
  },
  bannerContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  bannerImage: {
    width: '100%',
    maxWidth: '800px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: '32px',
    color: '#333',
    textAlign: 'left',
    marginBottom: '20px',
  },
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    backgroundColor: '#c2d8be',
    padding: '20px',
    borderRadius: '10px',
  },
  postCard: {
    padding: '20px',
    backgroundColor: '#4a6a57',
    borderRadius: '10px',
    textAlign: 'center',
    color: '#fff',
  },
  postTitle: {
    fontSize: '20px',
    color: '#fff',
    marginBottom: '10px',
  },
  postDescription: {
    color: '#ddd',
    marginBottom: '10px',
  },
  imageCarousel: {
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '150px',
    borderRadius: '10px',
    objectFit: 'cover',
  },
  carouselControls: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10px',
  },
  carouselButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    margin: '0 5px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  carouselCounter: {
    fontSize: '14px',
    color: '#fff',
  },
};

export default Home;

import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './Profile.css';

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    picture: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserMetadata = async () => {
        try {
          const token = await getAccessTokenSilently({
            audience: 'https://dev-b3clsyr1vtq0iuvi.us.auth0.com/api/v2/',
            scope: 'read:current_user',
          });

          const response = await fetch(`https://dev-b3clsyr1vtq0iuvi.us.auth0.com/api/v2/users/${user.sub}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const userMetadata = await response.json();
          setProfile(userMetadata);
          setFormData({
            name: userMetadata.user_metadata?.name || userMetadata.name,
            email: userMetadata.user_metadata?.email || userMetadata.email,
            picture: userMetadata.user_metadata?.picture || userMetadata.picture,
          });
        } catch (error) {
          console.error('Error fetching user metadata', error);
        }
      };
      fetchUserMetadata();
    }
  }, [isAuthenticated, getAccessTokenSilently, user.sub]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: 'https://dev-b3clsyr1vtq0iuvi.us.auth0.com/api/v2/',
        scope: 'update:current_user_metadata',
      });

      const auth0UserId = user.sub;
      const url = `https://dev-b3clsyr1vtq0iuvi.us.auth0.com/api/v2/users/${auth0UserId}`;

      const data = {
        user_metadata: {
          name: formData.name,
          email: formData.email,
          picture: formData.picture,
        }
      };

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error response:", errorResponse);
        throw new Error('Network response was not ok');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setFormData({
        name: updatedProfile.user_metadata.name,
        email: updatedProfile.user_metadata.email,
        picture: updatedProfile.user_metadata.picture,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-page">
      <div className="context">
        <h1>User Profile</h1>
      </div>
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      {isAuthenticated ? (
        <div className="profile-container">
          {isEditing ? (
            <form id="profile-form" className="profile-edit-form">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="file"
                name="picture"
                onChange={handleChange}
              />
              <button type="button" onClick={handleSave}>Save</button>
            </form>
          ) : (
            <div className="profile-info">
              <img src={profile.user_metadata?.picture || profile.picture} alt="Profile" className="profile-pic" />
              <p>Name: {profile.user_metadata?.name || profile.name}</p>
              <p>Email: {profile.user_metadata?.email || profile.email}</p>
              <button onClick={handleEdit} className="edit-btn">Edit</button>
            </div>
          )}
        </div>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
};

export default Profile;

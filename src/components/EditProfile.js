import StyledEditProfile from "../styles/StyledEditProfile";
import StyledButton from "../styles/StyledButton";
import Loading from "./Loading";
import uploadImage from "../utils/cloudinary";
import { useState, useEffect } from "react";
import { useFetcher } from "react-router-dom";
import axios from "axios";
import { database } from "../data/constants";
import useLocalStorage from "../hooks/useLocalStorage";

const EditProfile = ({ update, setUpdate }) => {
  const [firstName, setFirstName] = useLocalStorage("firstName", "");
  const [lastName, setLastName] = useLocalStorage("lastName", "");
  const setAvatar = useLocalStorage("avatar", "")[1];

  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  let fetcher = useFetcher();

  useEffect(() => {
    async function updateUser(data) {
      const response = await axios({
        method: "POST",
        url: `${database}/edit`,
        headers: { Authorization: `Bearer ${localStorage.token}` },
        data,
      });

      setFirstName(response.data.user.firstName);
      setLastName(response.data.user.lastName);
      setAvatar(response.data.user.avatar);

      setUpdate(!update);
    }

    function isEdited(formData) {
      if (formData.firstName !== localStorage.getItem("firstName")) {
        return true;
      }
      if (formData.lastName !== localStorage.getItem("lastName")) {
        return true;
      }
      if (formData.imageUrl) {
        return true;
      }
      return false;
    }

    if (fetcher.formData) {
      const formData = Object.fromEntries(fetcher.formData);
      if (isEdited(formData)) {
        updateUser(formData);
      }
    }
  }, [fetcher, setFirstName, setLastName, setAvatar, setUpdate, update]);

  return (
    <StyledEditProfile>
      <fetcher.Form>
        <h3>Edit Profile</h3>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          placeholder={firstName}
          name="firstName"
          id="firstName"
          autoFocus
          defaultValue={firstName}
        ></input>
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          placeholder={lastName}
          defaultValue={lastName}
          name="lastName"
          id="lastName"
        ></input>
        <label htmlFor="avatar">Avatar</label>
        {imageUrl ? (
          <>
            <img src={imageUrl} alt="" className="avatarImage"></img>
            <button
              className="resetButton"
              type="reset"
              onClick={() => setImageUrl("")}
            >
              Clear Avatar
            </button>
          </>
        ) : (
          <input
            type="file"
            accept="image/*"
            id="avatar"
            name="avatar"
            onChange={(e) => {
              setIsLoading(true);
              const reader = new FileReader();
              reader.readAsDataURL(e.target.files[0]);
              reader.onerror = () => console.log("Failed to convert to base64");
              reader.onload = async () => {
                const { data } = await uploadImage(reader.result);
                setImageUrl(data.secure_url);
                setIsLoading(false);
              };
            }}
          ></input>
        )}
        <input
          hidden
          readOnly
          type="text"
          name="imageUrl"
          value={imageUrl}
        ></input>
        <input
          hidden
          readOnly
          type="text"
          name="userId"
          value={localStorage.getItem("userId")}
        ></input>
        {isLoading ? <Loading /> : <StyledButton>Update</StyledButton>}
      </fetcher.Form>
    </StyledEditProfile>
  );
};

export default EditProfile;

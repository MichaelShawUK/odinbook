import StyledButton from "../styles/StyledButton";
import LoadingCard from "./LoadingCard";
import StyledFriendRequest from "../styles/StyledFriendRequest";
import { useFetcher } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { database, demoUserId } from "../data/constants";

const FriendRequest = ({ user, update, setUpdate }) => {
  const loggedInUserId = localStorage.getItem("userId");

  const friendIds = user.friends.map((friend) => friend._id);
  const isFriend = friendIds.includes(loggedInUserId);

  const friendRequestIds = user.friendRequests.map((request) => request._id);
  const isRequestPending = friendRequestIds.includes(loggedInUserId);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  let fetcher = useFetcher();

  useEffect(() => {
    async function unfriendUsers() {
      await axios({
        method: "POST",
        url: `${database}/friendship`,
        headers: { Authorization: `Bearer ${localStorage.token}` },
        data: { friend: user._id },
      });
      setIsLoading(false);
      setUpdate(!update);
    }

    async function sendFriendRequest() {
      await axios({
        method: "POST",
        url: `${database}/befriend`,
        headers: { Authorization: `Bearer ${localStorage.token}` },
        data: { receiver: user._id },
      });
      setIsLoading(false);
      setUpdate(!update);
    }

    if (fetcher.formData) {
      if (localStorage.getItem("userId") === demoUserId) {
        setError(true);
      } else {
        const formData = Object.fromEntries(fetcher.formData);
        setIsLoading(true);

        if (Object.keys(formData).includes("isFriend")) {
          unfriendUsers();
        } else {
          sendFriendRequest();
        }
      }
    }
  }, [fetcher, user, update, setUpdate]);

  return (
    <StyledFriendRequest>
      <img src={user.avatar} alt=""></img>
      <div className="name">{`${user.firstName} ${user.lastName}`}</div>
      {isRequestPending ? (
        <div className="pending">
          Awaiting {user.firstName}'s response from friendship request
        </div>
      ) : (
        <>
          <fetcher.Form>
            <input
              type="text"
              name="receiver"
              defaultValue={user._id}
              hidden
              readOnly
            ></input>
            <input
              type="checkbox"
              name="isFriend"
              checked={isFriend}
              readOnly
              hidden
            ></input>
            {isFriend ? (
              <StyledButton>Unfriend</StyledButton>
            ) : (
              <StyledButton>Friend Request</StyledButton>
            )}
          </fetcher.Form>
          {error && (
            <p className="error center">
              Handling friendship status is disabled for the demo. Create new
              account for full functionality
            </p>
          )}
        </>
      )}
      {isLoading && <LoadingCard />}
    </StyledFriendRequest>
  );
};

export default FriendRequest;

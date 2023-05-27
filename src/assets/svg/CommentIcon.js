const CommentIcon = ({ showComments, setShowComments }) => {
  return (
    <svg
      width="32px"
      height="32px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      onClick={() => setShowComments(!showComments)}
    >
      <g id="SVGRepo_iconCarrier">
        <path
          fill="#F9A826"
          d="M2 6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7.667a1 1 0 0 0-.6.2L3.6 21.8A1 1 0 0 1 2 21V6zm5 0a1 1 0 0 0 0 2h10a1 1 0 1 0 0-2H7zm0 4a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2H7zm0 4a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2H7z"
        />
      </g>
    </svg>
  );
};

export default CommentIcon;

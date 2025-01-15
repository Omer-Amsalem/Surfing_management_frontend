import Post from "./Post";

interface ProfileSummaryProps {
  userPhoto: string;
  firstName: string;
  lastName: string;
  team: string;
  description: string;
}

const ProfileSummary = ({
  userPhoto,
  firstName,
  lastName,
  team,
  description,
}: ProfileSummaryProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mx-auto mt-4">
      {/*  Profile image */}
      <img
        src={userPhoto}
        alt={`${firstName} ${lastName}`}
        className="w-32 h-32 rounded-full mx-auto border-2 border-blue-500 mb-4"
      />

      {/* User Name*/}
      <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-3 pb-2">{`${firstName} ${lastName}`}</h2>

      {/* Team Section */}
      <div className="flex justify-start items-center mt-2">
        <p className="text-gray-800 font-semibold">Team:</p>
        <p className="text-gray-600 ml-2">{team || "No team specified"}</p>
      </div>

      {/* About me Section */}
      <div className="mt-3 text-left">
        <p className="text-gray-800 font-semibold mb-1">About me:</p>
        <p className="text-gray-600">
          {description || "No description provided."}
        </p>
      </div>

      {/* My Sessions Section - Scrollable */}
      <div className="mt-6">
        <h2 className="sticky top-0 bg-white text-2xl font-extrabold text-blue-600 border-b-2 border-blue-400 pb-2 mb-4">
          My Sessions
        </h2>
        <div className="overflow-y-auto h-[400px] border border-gray-300 rounded-md">
          <Post apiUrl="http://localhost:3000/user/activities" />
        </div>
      </div>
    </div>
  );
};

export default ProfileSummary;

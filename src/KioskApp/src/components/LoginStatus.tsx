import { useAuthStore } from '../stores/authStore';

export default function LoginStatus() {
  const { isLoggedIn, user, login, logout } = useAuthStore();

  const handleLogin = () => {
    const phoneNumber = prompt('Enter your phone number:');
    if (phoneNumber) {
      login(phoneNumber);
    }
  };

  return (
    <div className="bg-blue-100 p-2">
      <div className="container mx-auto text-center">
        {isLoggedIn && user ? (
          <div className="flex justify-center items-center gap-4">
            <span className="text-blue-800">
              Welcome! Points: {user.rewardPoints}
            </span>
            <button
              onClick={logout}
              className="text-sm bg-blue-600 text-white px-2 py-1 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="text-blue-800 underline"
          >
            Please log in to earn rewards
          </button>
        )}
      </div>
    </div>
  );
}
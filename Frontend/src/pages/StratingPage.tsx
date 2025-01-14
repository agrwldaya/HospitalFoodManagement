import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AdminSliceActions } from '../store/adminstore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", { email, password, role });
      if (res.data.success) {
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.user.username);
        localStorage.setItem("email", res.data.user.email);
        dispatch(AdminSliceActions.login());
        toast.success('Login successful');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred during login');
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const icons = document.querySelectorAll('.animate-float')
      icons.forEach((icon) => {
        icon.setAttribute('transform', `translate(0, ${Math.sin(Date.now() / 1000) * 10})`)
      })
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden">
      {/* Animated Background */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <g className="animate-float opacity-20">
          <path d="M30 30L90 30L60 90Z" fill="#86efac" />
          <circle cx="150" cy="150" r="40" fill="#34d399" />
          <rect x="240" y="30" width="60" height="60" fill="#22c55e" />
        </g>
        <g className="animate-float opacity-20" style={{ animationDelay: '0.5s' }}>
          <path d="M330 230L390 230L360 290Z" fill="#34d399" />
          <circle cx="450" cy="350" r="40" fill="#86efac" />
          <rect x="540" y="230" width="60" height="60" fill="#22c55e" />
        </g>
        <g className="animate-float opacity-20" style={{ animationDelay: '1s' }}>
          <path d="M50 450L110 450L80 510Z" fill="#86efac" />
          <circle cx="170" cy="570" r="40" fill="#34d399" />
          <rect x="260" y="450" width="60" height="60" fill="#22c55e" />
        </g>
      </svg>

      <div className="flex w-full items-center justify-center p-8 relative z-10">
        {/* Welcome Text */}
        <div className="hidden lg:block w-1/3 pr-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome Back!</h1>
          <p className="text-lg text-gray-600">
            Access the Hospital Food Management System to streamline meal planning, kitchen operations, and delivery tracking.
          </p>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-md">
          <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white border-opacity-30">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
              <p className="text-gray-600">Access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-colors"
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Role
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['admin', 'pantry', 'delivery'].map((r) => (
                    <div
                      key={r}
                      className={`
                        cursor-pointer rounded-lg p-3 text-center transition-colors
                        ${role === r
                          ? 'bg-green-700 text-white'
                          : 'bg-white bg-opacity-50 text-gray-700 hover:bg-gray-100 hover:bg-opacity-50'
                        }
                      `}
                      onClick={() => setRole(r)}
                    >
                      <div className="font-medium capitalize">{r}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-700 bg-opacity-90 text-white py-3 rounded-lg hover:bg-opacity-100 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

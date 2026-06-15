import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      loginWithGoogle(code)
        .then((result) => {
          if (result.success) {
            // Berhasil login, redirect ke halaman utama/dashboard
            navigate('/');
          } else {
            setError(result.message);
            // Sediakan fallback redirect jika gagal setelah 3 detik
            setTimeout(() => navigate('/masuk'), 3000);
          }
        });
    } else {
      navigate('/masuk');
    }
  }, [searchParams, loginWithGoogle, navigate]);

  if (error) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-black">
        <div className="text-center font-poppins">
          <p className="text-red-500 text-lg mb-2">❌ {error}</p>
          <p className="text-gray-400">Mengonversi kembali ke halaman login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-black">
      <div className="text-center font-poppins">
        {/* Spinner dengan accent warna Gold Barbershop */}
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FFB22C] border-t-transparent mx-auto mb-4" />
        <p className="text-white text-lg">Memproses autentikasi Google...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, Check, AlertCircle, Loader2 } from 'lucide-react';
import { apiUrl } from '../lib/api';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  className?: string;
  variant?: 'default' | 'large';
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess, className, variant = 'default' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError('');
    setSuccess(false);
    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Send file to backend
      const res = await axios.post(apiUrl('/upload'), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(true);
      onUploadSuccess(res.data.url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      
      <button
        type="button"
        onClick={triggerInput}
        disabled={loading}
        className={variant === 'large' 
          ? `w-full aspect-[16/4] flex flex-col items-center justify-center space-y-3 rounded-2xl border-2 border-dashed transition-all duration-300 ${
              success 
                ? 'bg-green-50 border-green-200 text-green-600' 
                : error 
                  ? 'bg-red-50 border-red-200 text-red-500'
                  : 'bg-gray-50/50 dark:bg-neutral-800/30 border-gray-100 dark:border-neutral-800 text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800/50'
            } disabled:opacity-70`
          : `flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
              success 
                ? 'bg-green-500 text-white' 
                : error 
                  ? 'bg-red-50 text-red-500 border border-red-200'
                  : 'bg-black text-white dark:bg-white dark:text-black hover:scale-[1.02]'
            } disabled:opacity-70`}
      >
        {loading ? (
          <>
            <Loader2 size={variant === 'large' ? 24 : 18} className="animate-spin" />
            <span className={variant === 'large' ? 'text-xs font-bold uppercase tracking-widest' : ''}>
              {variant === 'large' ? 'Uploading...' : 'Uploading...'}
            </span>
          </>
        ) : success ? (
          <>
            <Check size={variant === 'large' ? 24 : 18} />
            <span className={variant === 'large' ? 'text-xs font-bold uppercase tracking-widest' : ''}>Uploaded!</span>
          </>
        ) : error ? (
          <>
            <AlertCircle size={variant === 'large' ? 24 : 18} />
            <span className={variant === 'large' ? 'text-xs font-bold uppercase tracking-widest' : ''}>Error</span>
          </>
        ) : (
          <>
            <div className={variant === 'large' ? 'p-3 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700' : ''}>
              <Upload size={variant === 'large' ? 20 : 18} className={variant === 'large' ? 'text-gray-400' : ''} />
            </div>
            <span className={variant === 'large' ? 'text-xs font-bold uppercase tracking-widest text-gray-400' : ''}>
              {variant === 'large' ? 'Select File' : 'Upload Image'}
            </span>
          </>
        )}
      </button>

      {error && (
        <p className="mt-2 text-xs text-red-500 font-medium ml-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;

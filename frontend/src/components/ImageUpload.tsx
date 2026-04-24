import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, Check, AlertCircle, Loader2 } from 'lucide-react';
import { apiUrl } from '../lib/api';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess, className }) => {
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
        className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
          success 
            ? 'bg-green-500 text-white' 
            : error 
              ? 'bg-red-50 text-red-500 border border-red-200'
              : 'bg-black text-white dark:bg-white dark:text-black hover:scale-[1.02]'
        } disabled:opacity-70`}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Uploading...</span>
          </>
        ) : success ? (
          <>
            <Check size={18} />
            <span>Uploaded!</span>
          </>
        ) : error ? (
          <>
            <AlertCircle size={18} />
            <span>Error</span>
          </>
        ) : (
          <>
            <Upload size={18} />
            <span>Upload Image</span>
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

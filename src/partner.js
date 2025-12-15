import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, LogIn, User, Lock } from 'lucide-react';

export default function PartnerLoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login API call here
    // For demo purposes, we'll just set logged in to true
    setIsLoggedIn(true);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
      if (isExcel) {
        setSelectedFile(file);
        setUploadStatus(null);
      } else {
        setUploadStatus({ type: 'error', message: 'Please select a valid Excel file (.xlsx, .xls, or .csv)' });
      }
    }
  };

  // Handle file upload
  const handleSubmit = async () => {
    if (!selectedFile) {
      setUploadStatus({ type: 'error', message: 'Please select a file first' });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Add your API call here
      // Example:
      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   body: formData,
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setUploadStatus({ type: 'success', message: 'File uploaded successfully!' });
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('fileInput');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Upload failed. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
      if (isExcel) {
        setSelectedFile(file);
        setUploadStatus(null);
      } else {
        setUploadStatus({ type: 'error', message: 'Please select a valid Excel file (.xlsx, .xls, or .csv)' });
      }
    }
  };

  // Excel Upload UI (After Login)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Partner Dashboard</h1>
          <p className="text-gray-400">Upload your Excel data sheet</p>
        </div>

        {/* Upload Card */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div>
            {/* Drag and Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                selectedFile
                  ? 'border-green-500 bg-green-500 bg-opacity-5'
                  : 'border-gray-600 hover:border-green-500 hover:bg-gray-700'
              }`}
            >
              <input
                type="file"
                id="fileInput"
                onChange={handleFileChange}
                accept=".xlsx,.xls,.csv"
                className="hidden"
              />
              
              <label htmlFor="fileInput" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-4">
                  {selectedFile ? (
                    <>
                      <FileSpreadsheet className="w-16 h-16 text-green-500" />
                      <div>
                        <p className="text-xl font-semibold text-white">{selectedFile.name}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedFile(null);
                          const fileInput = document.getElementById('fileInput');
                          if (fileInput) fileInput.value = '';
                        }}
                        className="text-sm text-red-400 hover:text-red-300 underline"
                      >
                        Remove file
                      </button>
                    </>
                  ) : (
                    <>
                      <Upload className="w-16 h-16 text-gray-400" />
                      <div>
                        <p className="text-xl font-semibold text-white mb-2">
                          Drop your Excel file here
                        </p>
                        <p className="text-sm text-gray-400">
                          or click to browse
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Supports: .xlsx, .xls, .csv</span>
                      </div>
                    </>
                  )}
                </div>
              </label>
            </div>

            {/* Status Messages */}
            {uploadStatus && (
              <div
                className={`mt-6 p-4 rounded-lg flex items-start space-x-3 ${
                  uploadStatus.type === 'success'
                    ? 'bg-green-500 bg-opacity-10 border border-green-500'
                    : 'bg-red-500 bg-opacity-10 border border-red-500'
                }`}
              >
                {uploadStatus.type === 'success' ? (
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p
                    className={`font-medium ${
                      uploadStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {uploadStatus.message}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-8">
              <button
                onClick={handleSubmit}
                disabled={!selectedFile || uploading}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  !selectedFile || uploading
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-black transform hover:scale-105 active:scale-95'
                }`}
              >
                {uploading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Uploading...</span>
                  </span>
                ) : (
                  'Submit Excel File'
                )}
              </button>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setSelectedFile(null);
                setUploadStatus(null);
              }}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Logout from Partner Dashboard
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">Upload Instructions:</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Ensure your Excel file is in .xlsx, .xls, or .csv format</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Maximum file size: 10MB</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Make sure all required columns are present in your sheet</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Data will be processed immediately after submission</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
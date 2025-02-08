// DisplaySetup.js
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Monitor, ArrowLeft } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const socket = io(API_URL); // Replace with your backend server address

const DisplaySetup = () => {
  const [code, setCode] = useState('');

  // Set up the socket listener once
  useEffect(() => {
    socket.on('receiveCode', (data) => {
      console.log('Received server code:', data.code);
      localStorage.setItem('hexaCode', data.code);
      setCode(data.code);
    });

    return () => {
      socket.off('receiveCode'); // Cleanup on unmount
    };
  }, []); // Empty dependency array ensures this runs only once

  const generateCode = () => {
    // Emit an event to the server to request a new code
    socket.emit('generateCode');
    console.log('Requesting new code from server...');
  };

  const copyToClipboard = () => {
    // Remove spaces from the code
    const codeWithoutSpaces = code.replace(/\s+/g, '');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(codeWithoutSpaces)
        .then(() => {
          toast.success('Code copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy: ', err);
          toast.error('Failed to copy code to clipboard.');
        });
    } else {
      // Fallback method for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = codeWithoutSpaces;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('Code copied to clipboard!');
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        toast.error('Failed to copy code to clipboard.');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 text-white rounded-lg p-6 w-full max-w-md shadow-lg">
        {/* Back Button */}
        <div className="flex justify-between items-center mb-6">
          <button
            className="text-sm text-gray-400 hover:text-white flex items-center"
            onClick={() => console.log('Back button clicked')}
          >
            <span className="mr-2">
              <ArrowLeft className="h-5 w-5 text-white-400" />
            </span>{' '}
            Back
          </button>
          <button
            className="text-sm text-gray-400 hover:text-white"
            onClick={generateCode}
          >
            Reset Display
          </button>
        </div>

        {/* Icon and Title */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 rounded-full p-4">
              <Monitor className="h-10 w-10 text-white-400" />
            </div>
          </div>
          <h1 className="text-xl font-semibold">Display Setup</h1>
        </div>

        {/* Display Code */}
        <div className="bg-gray-700 rounded-md p-4 text-center mb-4">
          <p className="text-gray-400 text-sm mb-2">Your Display Code:</p>
          <p className="text-3xl font-bold text-blue-400 tracking-widest">
            {code && code}
          </p>
          <button onClick={copyToClipboard}>Copy</button>
          <p className="text-gray-400 text-sm mt-2">
            Use this code in the admin panel to connect this display to a store.
          </p>
        </div>

        {/* Connection Status */}
        <div className="text-center text-gray-400 text-sm">
          • Copy code and switch to the previous tab...
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default DisplaySetup;

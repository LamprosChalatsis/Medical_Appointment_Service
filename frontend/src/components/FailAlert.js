import React from 'react';

const Alert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div
      className="relative w-full max-w-64 flex flex-wrap items-center justify-center py-3 pl-4 pr-14 rounded-lg text-base font-medium border border-[#f85149] text-[#b22b2b] bg-[linear-gradient(#f851491a,#f851491a)]"
      role="alert"
    >
      <button
        type="button"
        aria-label="close-error"
        onClick={(e) => {
          e.stopPropagation(); // prevent bubbling
          if (typeof onClose === 'function') {
            onClose();
          }
        }}
        className="absolute right-4 p-1 rounded-md text-[#f85149] border border-[#f85149] opacity-40 hover:opacity-100"
      >
        <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={16} width={16}>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>

      <p className="flex flex-row items-center mr-auto gap-x-2">
        <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={28} width={28}>
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
        {message}
      </p>
    </div>
  );
};

export default Alert;

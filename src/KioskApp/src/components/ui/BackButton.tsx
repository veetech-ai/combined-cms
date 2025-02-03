interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick} 
      className="flex items-center gap-2 text-black"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="1.5" strokeLinecap="square"/>
      </svg>
      <span>Back</span>
    </button>
  );
}
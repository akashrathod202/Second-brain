type SubmitButtonProps = {
    title: string;
    loading?: boolean;
  };
  
  export const SubmitButton = ({
    title,
    loading = false,
  }: SubmitButtonProps) => {
    return (
      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          px-4 py-2.5
          rounded-lg
          text-sm
          font-medium
          bg-amber-500
          text-black
          hover:bg-amber-400
          transition
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {loading ? "Signing in..." : title}
      </button>
    );
  };
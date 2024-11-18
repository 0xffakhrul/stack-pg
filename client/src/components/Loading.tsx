import { Loader2 } from "lucide-react";

export const Loading = () => {
  return (
    <div className="flex flex-col gap-2 justify-center items-center min-h-screen">
      <Loader2 className="animate-spin text-white h-16 w-16" />
      <p className="text-white">
        This application is deployed on free-tier hosting, hence the loading
        time could take longer than expected.
      </p>
    </div>
  );
};

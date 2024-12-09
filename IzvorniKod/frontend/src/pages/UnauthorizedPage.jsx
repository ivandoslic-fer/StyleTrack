import { Button } from "@mui/material";
import img from '../assets/unauthorized.png';

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-100">
      <div className="flex justify-center mt-8 w-full">
        <img
          src={img}
          alt="Unauthorized Access"
          className="h-[30vh] md:h-[50vh] object-contain"
        />
      </div>
      <div className="text-center px-4">
        <h1 className="text-3xl font-bold text-gray-800 mt-5">Unauthorized!</h1>
        <p className="text-lg text-gray-600 mt-2 mb-5 px-8">
          Oops! Looks like you're not dressed for this occasion.
        </p>
        <Button
          variant="contained"
          color="primary"
          className="mt-4"
          onClick={() => (window.location.href = "/")}
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;

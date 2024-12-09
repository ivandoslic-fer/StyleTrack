import React from "react";
import emptyHanger from "../assets/nothing.png";

const EmptyPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Oops! It's empty here</h1>
        <p className="text-lg text-gray-600 mt-2 px-8">
            Nothing to see here — except infinite possibilities for style!
        </p>
      </div>
      <div className="mt-6">
        <img
          src={emptyHanger}
          alt="Empty Hanger"
          className="h-[30vh] md:h-[50vh] mx-auto"
        />
      </div>
    </div>
  );
};

export default EmptyPage;

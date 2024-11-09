import React, { useState, useMemo } from "react";
import { PricingCard } from "../../components/ui/PricingCard";
import { useGetAllProductsQuery } from "../../services/products";
import { useSelector } from "react-redux";
import { mockProductsList } from "../../services/mocks/productMocks";

const getMockProduct = (id) =>
  mockProductsList.find((product) => product.id === id);

export const Pricing = () => {
  const { data: products, error, isLoading } = useGetAllProductsQuery();
  const [selectedMonth, setSelectedMonth] = useState(1);
  const userId = useSelector((state) => state.user.id);

  const filteredProducts = useMemo(() => {
    return (
      products
        ?.filter((product) => product.month === selectedMonth)
        .reverse() || []
    );
  }, [products, selectedMonth]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>An error occurred: {error.message}</p>;
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-grow items-center justify-center">
        {/* How It Works Section */}
        <div className="flex justify-center items-center mt-12 mb-10 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl">
            <h1 className="text-4xl sm:text-5xl font-medium">How It Works</h1>
            <p className="text-sm mt-4">
              Choose the plan that suits you best. Want more flexibility? Adjust
              your subscription to meet your needs effortlessly!
            </p>
          </div>
        </div>

        {/* Month Selection Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-8 font-semibold">
          {[1, 3, 6, 12].map((month) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`flex items-center px-3 py-2 rounded-lg shadow-sm ${
                selectedMonth === month ? "bg-accent text-white shadow-md" : ""
              }`}
            >
              {month} month{month > 1 && "s"}
              {month === 6 && (
                <div className="ml-1 py-1 px-2 bg-white rounded-lg text-accent font-bold">
                  -20%
                </div>
              )}
              {month === 12 && (
                <div className="ml-1 py-1 px-2 bg-white rounded-lg text-accent font-bold">
                  -40%
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="flex justify-center items-center w-full mt-8">
          <div className="flex flex-wrap justify-center items-center lg:gap-6 w-full">
            {filteredProducts.map((card, index) => (
              <PricingCard
                key={card.id}
                type={index + 1}
                cardData={card}
                userId={userId}
                isLastCard={index === filteredProducts.length - 1}
                selectedMonth={selectedMonth}
                mockData={getMockProduct(card.product)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

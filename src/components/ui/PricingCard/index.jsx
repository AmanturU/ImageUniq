import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useCreateStripeCheckoutSessionMutation } from "../../../services/payment";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const getCardStyles = (type, isLastCard) => {
  if (isLastCard) {
    return "w-full md:w-[250px] lg:w-[300px] md:h-[484px] bg-gradient-to-b from-gray-800 to-black text-white";
  }
  const styleMap = {
    1: "w-full md:w-[250px] lg:w-[300px] h-[484px] bg-white text-black",
    2: "w-full md:w-[280px] lg:w-[340px] h-[542px] bg-white text-black",
    3: "w-full md:w-[250px] lg:w-[300px] h-[484px] bg-white text-black",
  };
  return styleMap[type] || styleMap[1];
};

const getFeatureText = (type) => {
  const featureMap = {
    1: ["300 images per day", "$0.005 per image"],
    2: ["1000 images per day", "$0.002 per image"],
    3: ["5000 images per day", "$0.001 per image"],
  };
  return featureMap[type] || featureMap[1];
};

// Функция получения цветовых стилей текста
const getTextColorStyles = (isLastCard) =>
  isLastCard ? "text-white" : "text-gray-500";

// Функция получения пути к иконке галочки
const getIconColorStyles = (isLastCard) =>
  isLastCard ? "/tick-w.png" : "/tick.png";

export const PricingCard = ({
  type = 1,
  cardData,
  userId,
  isLastCard = false,
  selectedMonth,
  mockData,
  ...restProps
}) => {
  const [createCheckoutSession] = useCreateStripeCheckoutSessionMutation();
  const paymentItem = {
    user_id: userId,
    monthly_product_id: cardData.id,
  };

  const perMonth = (cardData.get_total_sum / selectedMonth).toFixed(2);

  const isAuthenticated = useAuth();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const { data } = await createCheckoutSession(paymentItem);
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        console.error("Error redirecting to checkout:", error);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  const cardStyles = getCardStyles(type, isLastCard);
  const [cardsPerDayText, pricePerImageText] = getFeatureText(type);
  const textColorStyles = getTextColorStyles(isLastCard);
  const iconColorStyles = getIconColorStyles(isLastCard);

  return (
    <div
      className={`${cardStyles} border-2 rounded-3xl p-8 mb-8 shadow-cm`}
      {...restProps}
    >
      {/* Заголовок и описание */}
      <h2 className="text-xl font-semibold">{mockData?.name}</h2>
      <p className={textColorStyles}>{mockData?.description}</p>

      {selectedMonth !== 1 ? (
        <div>
          <div className="flex items-end pt-4">
            <div className="mt-4 lg:text-4xl text-3xl font-medium">
              ${perMonth}
            </div>
            <p className={textColorStyles}>/ per month</p>
          </div>
          {selectedMonth !== 1 && (
            <div className="flex items-end">
              <div className="mt-4 text-xl font-thin">
                Total sum: {cardData.get_total_sum}$
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-end pt-4">
          <div className="mt-4 lg:text-4xl text-3xl font-medium">
            ${cardData.get_total_sum}
          </div>
          <p className={textColorStyles}>/ per month</p>
        </div>
      )}

      {/* TODO: Add when stripe will connected */}
      {/* <button
        onClick={handleClick}
        className="mt-8 w-full h-[44px] px-4 py-2 border border-gray-300 rounded-full"
      >
        {isAuthenticated ? "Go to payment" : "Get started"}
      </button> */}

      <button
        className="mt-8 w-full h-[44px] px-4 py-2 border border-gray-300 rounded-full"
        onClick={() => {
          window.location.href = "https://t.me/isceassistant";
        }}
      >
        {isAuthenticated ? "Go to payment" : "Get started"}
      </button>

      <div className="mt-8 pt-8 border-t-EDEDED border-t-[1px]">
        <h3 className="text-lg font-bold">Features</h3>
        <ul className={`${textColorStyles} mt-2`}>
          <li className="flex items-center">
            <img
              src={iconColorStyles}
              alt="tick"
              className="w-[16px] h-[16px] mr-1.5"
            />
            {cardsPerDayText}
          </li>
          <li className="flex items-center">
            <img
              src={iconColorStyles}
              alt="tick"
              className="w-[16px] h-[16px] mr-1.5"
            />
            {pricePerImageText}
          </li>
          <li className="flex items-center">
            <img
              src={iconColorStyles}
              alt="tick"
              className="w-[16px] h-[16px] mr-1.5"
            />
            {cardData.percent === 0
              ? "No discount"
              : `${cardData.percent}% discount`}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PricingCard;

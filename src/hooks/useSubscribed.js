import { useSelector } from "react-redux";

const useSubscribed = () => {
  const isSubscribed = useSelector((state) => state.user.is_paid);
  return isSubscribed;
};

export default useSubscribed;

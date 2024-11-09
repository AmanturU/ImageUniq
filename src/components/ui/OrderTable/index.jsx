import React from "react";
import PropTypes from "prop-types";
import { useMediaQuery } from "react-responsive";

const OrderTable = ({ orders }) => {
  // Определяем, отображаемся ли на экране шириной меньше 640px
  const isMobile = useMediaQuery({ maxWidth: 639 });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isMobile) {
      // Формат для мобильных устройств: HH:mm, dd.MM.yy
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    // Полный формат для более крупных экранов
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {orders.map((order, index) => {
        const key = Number(order.id) || index;
        return (
          <tr key={key} className="text-[#5A5A5A]">
            <td className="md:p-4 p-1 text-[11px] md:text-base">
              {order.title}
            </td>
            <td className="md:p-4 p-1 text-[11px] md:text-base">
              {order.images?.length || 0}
            </td>
            <td className="md:p-4 p-1 text-[11px] md:text-base">
              {order.images?.length > 0
                ? formatDate(order.images[0].created_at)
                : "N/A"}
            </td>
            <td className="md:p-4 p-1 text-[11px] md:text-base">
              {order.images?.length > 0 ? order.images[0].status : "N/A"}
            </td>
            <td className="md:p-4 p-1 text-[11px] md:text-base">
              <button
                className="h-[25px]"
                onClick={() => handleDownload(order.zip_file)}
              >
                <img
                  src="/download.png"
                  width={20}
                  className="w-5"
                  alt="download"
                />
              </button>
            </td>
          </tr>
        );
      })}
    </>
  );
};

OrderTable.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      zip_file: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(
        PropTypes.shape({
          created_at: PropTypes.string.isRequired,
          status: PropTypes.string.isRequired,
        }),
      ),
    }),
  ).isRequired,
};

export default OrderTable;

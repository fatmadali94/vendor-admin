// import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Menu.scss";
import { menu } from "../../data";
import { useNewOffersCount } from "../../helpers/fetchOffers";

const Menu = () => {
  // const [newOffersCount, setNewOffersCount] = useState(0);

  const { data: offers } = useNewOffersCount();
  // console.log(offers?.length, "New Offers Count");

  // useEffect(() => {
  //   if (offers) {
  //     const viewedOffers =
  //       JSON.parse(localStorage.getItem("viewedOffers")) || [];
  //     const newOffers = offers.filter(
  //       (offer: { id: any }) => !viewedOffers.includes(offer.id)
  //     );
  //     setNewOffersCount(newOffers.length);
  //   }
  // }, [offers]);

  // const handleViewOffers = () => {
  //   if (offers) {
  //     const viewedOffers = offers.map((offer) => offer.id);
  //     localStorage.setItem("viewedOffers", JSON.stringify(viewedOffers));
  //     setNewOffersCount(0);
  //   }
  // };

  return (
    <div className="menu">
      {menu.map((item) => (
        <div className="item" key={item.id}>
          <span className="title">{item.title}</span>
          {item.listItems.map((listItem) => {
            console.log(listItem, "listitem");

            return (
              <Link to={listItem.url} className="listItem" key={listItem.id}>
                <img src={listItem.icon} alt="" />
                <span className="listItemTitle">{listItem.title}</span>

                {offers?.length > 0 && listItem.title === "Offers" && (
                  <span className="new-offers-count text-white">
                    {" "}
                    ({offers?.length})
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;

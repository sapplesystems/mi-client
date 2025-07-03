import React, { useEffect, useState } from "react";
import { Select, message } from "antd";
import Image from "next/image";
import Card from "../../assets/card.svg";
import Stroke from "../../assets/stroke.svg";
import ShoppingBag from "../../assets/shopping.svg";
import styles from "../../styles/Main.module.scss";
import apiRequest from "../../utils/request";

const adminStatsMap = [
  { key: "submitted", name: "Total Submitted applications", img: Stroke },
  { key: "approved", name: "Total Approved applications", img: ShoppingBag },
  { key: "rejected", name: "Total Rejected applications", img: Card },
];

const ministryStatsMap = [
  ...adminStatsMap,
  { key: "users_registered", name: "Users registered", img: Stroke },
  { key: "users_visited", name: "Users visited", img: ShoppingBag },
];

const Stats = () => {
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : "";

  const options = ["This week", "This month", "This year"];
  const [option, setOption] = useState(options);
  const handleOptionChange = (value) => setOption(value);
  const [stats, setStats] = useState({});
  const statsToShow = user.role === "admin" || user.role === "super_admin" ? adminStatsMap : ministryStatsMap;

  const getStats = async () => {
    const url = `api/v1/get-applications-stats/`;
    try {
      const res = await apiRequest({ method: "GET", url });
      setStats(res.data);
    } catch (error) {
      message.error(error.data.error);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  return (
    <div className={styles.overview__container}>
      <div className={styles.overview__header}>
        <div className={styles.overview__heading}>
          <span />
          <h4>Overview</h4>
        </div>
        {/* <div>
          <Select
            className={styles.select}
            defaultValue={options[0]}
            style={{
              width: 120,
            }}
            onChange={handleOptionChange}
            options={options.map((lng) => ({
              label: lng,
              value: lng,
            }))}
          />
        </div> */}
      </div>
      <div className={styles.card__container}>
        {statsToShow.map((item) => (
          <div className={styles.overview__card}>
            <span className={styles.card__icon}>
              <Image src={item.img} alt="" />
            </span>

            <p>{item.name}</p>
            <p>{stats[item.key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;

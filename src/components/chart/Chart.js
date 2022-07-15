import axios from "axios";
import { useEffect, useState } from "react";
import { Dropdown, Spinner } from "react-bootstrap";
import { Tooltip, XAxis, YAxis, AreaChart, Area } from "recharts";
import {
  ethereumToUsd,
  getOneEtherPriceInUSD,
} from "../../web3-service/ethereumToUsd";
import "./chart.scss";
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_API;

const Chart = ({ walletAddress }) => {
  const [totalPortFolioValue, setTotalPortFolioValue] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [selectedValueOfChart, setSelectedValuOfChart] = useState(24);
  const [localLoadingState, setLocalLoadingState] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLocalLoadingState(true);

        const response = await axios.post(`${BASE_URL}/owner/totalValue`, {
          owner_address: "0x41Ff21d36897CcCE5C83cb1A63a3E1749E9234BF",
          day: parseInt(selectedValueOfChart * 24),
        });
        const valueInUSD = await ethereumToUsd(
          response.data.payload[0].total_price,
          false
        );
        const ethInUSD = await getOneEtherPriceInUSD();

        const max = response.data.payload.reduce(function (a, b) {
          return Math.max(a, b.total_price);
        }, -Infinity);

        let newChartData = response.data.payload.map((item, idx) => {
          return {
            amount: (item.total_price * ethInUSD).toFixed(2),
            XAxis:
              idx === 0
                ? "0"
                : idx * 4 >= 24
                ? ((idx * 4) / 24).toFixed(0) + "d"
                : idx * 4 + "h",

            YAxis: idx === 0 ? 0 : max * ethInUSD,
            // YAxis: 100000,
          };
        });
        setChartData(newChartData);
        setTotalPortFolioValue(valueInUSD);
        setLocalLoadingState(false);
      } catch (error) {
        setLocalLoadingState(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="chart_main_wrap">
      <div>
        <div className="chart_heading">
          <p>Total portfolio value</p>
          <Dropdown
            onSelect={(eventKey) => setSelectedValuOfChart(eventKey)}
            className="chart_dropdown"
          >
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {`${
                selectedValueOfChart / 24 === 1
                  ? selectedValueOfChart / 24 + " Day"
                  : selectedValueOfChart / 24 + " Days"
              }`}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey={24}>1 Day</Dropdown.Item>
              <Dropdown.Item eventKey={168}>7 Day</Dropdown.Item>
              <Dropdown.Item eventKey={360}>15 Day</Dropdown.Item>
              <Dropdown.Item eventKey={720}>30 Day</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {localLoadingState ? (
          <div className="chart_spinner_wrp">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : chartData.length !== 0 ? (
          <>
            <div className="chart_value">${totalPortFolioValue.toFixed(2)}</div>
            <div>
              <AreaChart
                width={350}
                height={300}
                data={chartData}
                margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff002d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ff002d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis tickCount={4} dataKey="XAxis" />
                <YAxis tickCount={8} dataKey="YAxis" />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#ff002d"
                  fillOpacity={1}
                  fill="url(#colorPv)"
                />
              </AreaChart>
            </div>
          </>
        ) : (
          <div className="chart_data_not_found">
            <h3>Data Not Found </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart;

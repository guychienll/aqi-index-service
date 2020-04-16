import "./App.css";
import React from "react";
import ReactDOM from "react-dom";
import fetchJsonp from "fetch-jsonp";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      isLoading: true,
      cityName: "高雄市",
      casedata: {
        aqi: [156],
        status: ["對所有族群不健康"],
        siteName: ["前金"],
        publishTime: "1970-01-01 00:00",
        cityBeChoosed: "",
      },
      statusData: {
        siteName: "前金",
        aqi: 156,
        O3: "28",
        PM10: "13",
        PM25: "6",
        CO: "0.24",
        SO2: "1.6",
        NO2: "4.7",
        status: "對所有族群不健康",
      },
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }
  componentDidMount() {
    fetchJsonp(
      "https://json2jsonp.com/?url=http://opendata2.epa.gov.tw/AQI.json"
    )
      .then((res) => res.json())
      .then((json) => {
        const data = json.reduce((acc, record) => {
          const county = record.County;
          const groupedRecords = acc[county] || [];
          groupedRecords.push(record);
          acc[county] = groupedRecords;
          return acc;
        }, {});
        this.setState({
          data,
          isLoading: false,
        });
      })
      .catch((e) => console.log("catch", e));
  }
  changeHandler(e) {
    this.setState({
      cityName: e.target.value,
    });
    const data = this.state.data;
    const cityBeChoosed = data[e.target.value];
    const caseData = {
      aqi: cityBeChoosed.map((value) => value.AQI),
      status: cityBeChoosed.map((value) => value.Status),
      siteName: cityBeChoosed.map((value) => value.SiteName),
      publishTime: cityBeChoosed[0].PublishTime,
      cityBeChoosed: cityBeChoosed,
    };

    this.setState({
      casedata: caseData,
    });
  }
  clickHandler(key) {
    const cityBeChoosed = this.state.casedata.cityBeChoosed;
    const statusdata = {
      siteName: cityBeChoosed[key].SiteName,
      aqi: cityBeChoosed[key].AQI,
      O3: cityBeChoosed[key].O3,
      PM10: cityBeChoosed[key].PM10,
      PM25: cityBeChoosed[key]["PM2.5"],
      CO: cityBeChoosed[key].CO,
      SO2: cityBeChoosed[key].SO2,
      NO2: cityBeChoosed[key].NO2,
      status: cityBeChoosed[key].Status,
    };
    this.setState({
      statusData: statusdata,
    });
  }
  render() {
    return (
      <div>
        <div className="container">
          <Title
            change={this.changeHandler}
            cityName={Object.keys(this.state.data)}
          />
          <StandardTable />
          <City
            cityName={this.state.cityName}
            publish={this.state.casedata.publishTime}
          />
          <Status
            statusData={this.state.statusData}
            caseData={this.state.casedata}
            click={this.clickHandler}
          />
        </div>
        <div className="footer">
          <div className="datasrc">資料來源：行政院環境保護署</div>
          <div className="copyright">
            Copyright © 2019 HexSchool. All rights reserved.
          </div>
        </div>
      </div>
    );
  }
}

class Title extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="titleBox">
        <div className="title">空氣品質指標</div>
        <select
          onChange={this.props.change}
          value=""
          className="location"
          id="location"
        >
          <option value="">請選擇地區</option>
          {this.props.cityName.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

class StandardTable extends React.Component {
  render() {
    return (
      <div className="standardTableBox">
        <table className="standardTable">
          <thead>
            <tr>
              <th>0~50</th>
              <th>51~100</th>
              <th>101~150</th>
              <th>151~200</th>
              <th>201~300</th>
              <th>301~400</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div>良好</div>
              </td>
              <td>
                <div>普通</div>
              </td>
              <td>
                <div>對敏感族群不健康</div>
              </td>
              <td>
                <div>對所有族群不健康</div>
              </td>
              <td>
                <div>非常不健康</div>
              </td>
              <td>
                <div>危害</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class City extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="cityBox">
        <div className="cityName">{this.props.cityName}</div>
        <div className="line" />
        <div className="update">{this.props.publish} 更新</div>
      </div>
    );
  }
}

class Status extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { caseData } = this.props;
    const { statusData } = this.props;
    let statusBoxIndex = [];
    for (let i = 0; i < caseData.siteName.length; i++) {
      statusBoxIndex.push(i);
    }
    let color = "";
    switch (statusData.status) {
      case "良好":
        color = "#95F084";
        break;
      case "普通":
        color = "#FFE695";
        break;
      case "對敏感族群不健康":
        color = "#FFAF6A";
        break;
      case "對所有族群不健康":
        color = "#FF5757";
        break;
      case "非常不健康":
        color = "#9777FF";
        break;
      case "危害":
        color = "#AD1774";
        break;
      default:
        break;
    }
    return (
      <div className="status">
        <div className="box">
          <div className="chooseBox">
            <div className="name">{statusData.siteName}</div>
            <div className="num" style={{ backgroundColor: color }}>
              {statusData.aqi}
            </div>
          </div>
          <div className="o3">
            <div className="chinese">臭氧</div>
            <div className="english">
              O<small>2</small>(ppb)
            </div>
            <div className="value">{statusData.O3}</div>
          </div>
          <div className="pm10">
            <div className="chinese">懸浮微粒</div>
            <div className="english">
              PM<small>10</small>(μg/m³)
            </div>
            <div className="value">{statusData.PM10}</div>
          </div>
          <div className="pm25">
            <div className="chinese">細懸浮微粒</div>
            <div className="english">
              PM<small>2.5</small>(μg/m³)
            </div>
            <div className="value">{statusData.PM25}</div>
          </div>
          <div className="co">
            <div className="chinese">一氧化碳</div>
            <div className="english">CO(ppm)</div>
            <div className="value">{statusData.CO}</div>
          </div>

          <div className="so2">
            <div className="chinese">二氧化硫</div>
            <div className="english">
              SO<small>2</small>(ppb)
            </div>
            <div className="value">{statusData.SO2}</div>
          </div>
          <div className="no2">
            <div className="chinese">二氧化氮</div>
            <div className="english">
              NO<small>2</small>(ppb)
            </div>
            <div className="value">{statusData.NO2}</div>
          </div>
        </div>
        <div className="caseContainer">
          {statusBoxIndex.map((value) => (
            <StatusBox
              key={value}
              siteName={caseData.siteName[value]}
              aqi={caseData.aqi[value]}
              status={caseData.status[value]}
              keyValue={value}
              click={this.props.click}
            />
          ))}
        </div>
      </div>
    );
  }
}

class StatusBox extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let color = "";
    switch (this.props.status) {
      case "良好":
        color = "#95F084";
        break;
      case "普通":
        color = "#FFE695";
        break;
      case "對敏感族群不健康":
        color = "#FFAF6A";
        break;
      case "對所有族群不健康":
        color = "#FF5757";
        break;
      case "非常不健康":
        color = "#9777FF";
        break;
      case "危害":
        color = "#AD1774";
        break;
      default:
        break;
    }
    return (
      <div
        className="case"
        onClick={(e) => {
          this.props.click(this.props.keyValue);
        }}
      >
        <div className="name" value={this.props.siteName}>
          {this.props.siteName}
        </div>
        <div className="num" style={{ backgroundColor: color }}>
          {this.props.aqi}
        </div>
      </div>
    );
  }
}
